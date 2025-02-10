import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { WebSocketSubject } from 'rxjs/webSocket'; // rxjs WebSocketSubject


interface Identifiable {
  id: string;
}

interface JoinQuery{
  selector?:string;
  join?:string[];
  filter?:string;
}

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
export class CrudService<T> {

  private baseUrl = environment.use == 'assets' || environment.use == 'local' ? '/assets/dummy' : environment.api; // API base URL or dummy data for local
  private dataCache: { [key: string]: any[] } = {}; // Cache to hold table data
  private wsService = new WebSocketService();
  constructor(private http: HttpClient) { }

  // Create
  async create(table: string, data: Partial<T>): Promise<T> {
    if (environment.use == 'local') {
      // For 'local', we modify localStorage
      const dummyData: T[] = await this.getAll(table);
      dummyData.push({ ...data, id: `${Date.now()}` } as T); // Use timestamp for new ID
      localStorage.setItem(table, JSON.stringify(dummyData));
      return data as T;
    } else {
      const url = `${this.baseUrl}/${table}`;
      return firstValueFrom(this.http.post<T>(url, data));
    }
  }

  // Read (Get all records)
  async getAll(table: string): Promise<T[]> {
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
  getAllLive(table: string): Observable<T[]> {
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
        const updatedData = this.getAll(table); 
        updatedData.then(newData => {
          this.dataCache[table] = newData;
          dataSubject.next(newData);
        });
      }
    });
    return dataSubject.asObservable();
  }

  // Read (Get by ID)
  async get(table: string, id: string): Promise<T | undefined> {
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll(table);
      const item = dummyData.find(i => (i as any).id == id); // Accessing `id` in a type-safe way
      return item;
    } else {
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.get<T>(url));
    }
  }

  // Update
  async update(table: string, id: string, data: Partial<T>): Promise<T> {
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll(table);
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
  async partial_update(table: string, id: string, data: Partial<T>): Promise<T> {
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll(table);
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
  async delete(table: string, id: string): Promise<T | undefined> {
    if (environment.use == 'local') {
      const dummyData: T[] = await this.getAll(table);
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
