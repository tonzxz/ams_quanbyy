import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { WebSocketSubject } from 'rxjs/webSocket'; // rxjs WebSocketSubject

import * as DummyData from '../schema/dummy';


class WebSocketService {
  private socket: WebSocketSubject<any>;

  constructor() {
    this.socket = new WebSocketSubject(environment.api.replace('https','wss').replace('http', 'ws')); // WebSocket server URL
  }

  listenToTable(table: string): Observable<any> {
    return this.socket.asObservable().pipe(
      filter(message => message.table === table) // Only forward messages related to the given table
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private baseUrl = environment.use == 'assets' || environment.use == 'local' ? '/assets/dummy' : environment.api; // API base URL or dummy data for local
  private dataCache: { [key: string]: any[] } = {}; // Cache to hold table data
  private wsService = new WebSocketService();
  private getTableName(input: string): string {
    return input;
  }

  constructor(private http: HttpClient) {}
  
  async flushDummyData<T>(model: { new(): T }, data: T[]): Promise<void> {
    if(environment.use == 'local'){
      const table = this.getTableName(model.name);
      const dummyData: T[] = await this.getAll<T>(model);
      if(dummyData.length <= 0){
        localStorage.setItem(table, JSON.stringify(data));
      }
    }
  }

  // Create
  async create<T>(model: { new(): T }, data: Omit<T,'id'>): Promise<T> {
    const table = this.getTableName(model.name);
    if (environment.use == 'local') {
      // For 'local', we modify localStorage
      const dummyData: T[] = await this.getAll<T>(model);
      dummyData.push({ ...data, id: `${Date.now()}` } as T); // Use timestamp for new ID
      localStorage.setItem(table, JSON.stringify(dummyData));
      return dummyData[dummyData.length - 1];
    } else {
      const url = `${this.baseUrl}/${table}`;
      return firstValueFrom(this.http.post<T>(url, data));
    }
  }

  // Read (Get all records)
  async getAll<T>(model: { new(): T }): Promise<T[]> {
    const table =this.getTableName(model.name);
    await this.flushDummyData(model, DummyData[model.name + 'Data' as keyof (typeof DummyData)] as T[]);
    if (environment.use == 'local') {
      const dummyData = localStorage.getItem(table);
      if (dummyData) {
        try {
          return JSON.parse(dummyData) as T[];
        } catch (e) {
          return [];
        }
      } else {
        return [];
      }
    } else {
      const url = `${this.baseUrl}/${table}${environment.use == 'assets' ? '.json' : ''}`;
      return firstValueFrom(this.http.get<T[]>(url));
    }
  }

  // Method to return Observable that fetches data on WebSocket signal
  getAllLive<T>(model: { new(): T }): Observable<T[]> {
    const table = this.getTableName(model.name);
    const dataSubject = new BehaviorSubject<T[]>(this.dataCache[table] || []); // Subject to hold data
    
    // Listen to WebSocket updates for the table
    this.wsService.listenToTable(table).subscribe(() => {
      if (environment.use != 'local') {
        const url = `${this.baseUrl}/${table}${environment.use == 'assets' ? '.json' : ''}`;
        this.http.get<T[]>(url).subscribe((newData) => {
          this.dataCache[table] = newData; // Cache new data
          dataSubject.next(newData); // Emit new data
        });
      } else {
        // In 'local', listen to changes in localStorage (though, in practice, you might need a more event-driven approach for localStorage updates)
        this.flushDummyData(model, DummyData[model.name + 'Data' as keyof (typeof DummyData)] as T[]);
        const updatedData = this.getAll<T>(model); 
        updatedData.then(newData => {
          this.dataCache[table] = newData;
          dataSubject.next(newData);
        });
      }
    });
    return dataSubject.asObservable();
  }

  // Read (Get by ID)
  async get<T>(model: { new(): T }, id: string): Promise<T | undefined> {
    const table = this.getTableName(model.name);
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll<T>(model);
      const item = dummyData.find(i => (i as any).id == id); // Accessing `id` in a type-safe way
      return item;
    } else {
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.get<T>(url));
    }
  }

  // Update
  async update<T>(model: { new(): T }, id: string, data: Omit<T,'id'>): Promise<T> {
    const table = this.getTableName(model.name);
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll<T>(model);
      const replaceIndex = dummyData.findIndex(i => (i as any).id == id); // Accessing `id` in a type-safe way
      if (replaceIndex !== -1) {
        dummyData[replaceIndex] = { ...dummyData[replaceIndex], ...data };
        localStorage.setItem(table, JSON.stringify(dummyData));
        return dummyData[replaceIndex];
      } else {
        throw new Error('Item not found');
      }
    } else {
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.put<T>(url, data));
    }
  }

  // Partial Update
  async partial_update<T>(model: { new(): T }, id: string, data: Partial<Omit<T,'id'>>): Promise<T> {
    const table = this.getTableName(model.name);
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll<T>(model);
      const replaceIndex = dummyData.findIndex(i => (i as any).id == id); // Accessing `id` in a type-safe way
      if (replaceIndex !== -1) {
        dummyData[replaceIndex] = { ...dummyData[replaceIndex], ...data };
        localStorage.setItem(table, JSON.stringify(dummyData));
        return dummyData[replaceIndex];
      } else {
        throw new Error('Item not found');
      }
    } else {
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.patch<T>(url, data));
    }
  }

  // Delete
  async delete<T>(model: { new(): T }, id: string): Promise<T | undefined> {
    const table = this.getTableName(model.name);
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll<T>(model);
      console.log(dummyData);
      const index = dummyData.findIndex(i => (i as any).id == id); // Accessing `id` in a type-safe way
      if (index !== -1) {
        const deletedItem = dummyData.splice(index, 1)[0];
        localStorage.setItem(table, JSON.stringify(dummyData));
        return deletedItem;
      } else {
        throw new Error('Item not found');
      }
    } else {
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.delete<T>(url));
    }
  }
}
