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

  private baseUrl = environment.use == 'assets' ? '/assets/dummy' : environment.api; // Replace with your API base URL
  private dataCache: { [key: string]: any[] } = {}; // Cache to hold table data
  constructor(private http: HttpClient, private wsService:WebSocketService) { }

  // Create
  async create<T extends Identifiable>(table: string, data: T): Promise<T> {
    const url = `${this.baseUrl}/${table}`;
    if (environment.use == 'assets') {
      const dummyData: T[] = await this.getAll(table);
      dummyData.push(data);
      return data;
    } else {
      return firstValueFrom(this.http.post<T>(url, data));
    }
  }

  // Read (Get all records)
  async getAll<T extends Identifiable>(table: string, params?:JoinQuery): Promise<T[]> {
    const url = `${this.baseUrl}/${table}${environment.use == 'assets' ? '.json' : ''}`;
    return firstValueFrom(this.http.get<T[]>(url, {
      params: {
        ...params
      }
    }));
  }

  // Method to return Observable that fetches data on WebSocket signal
  getAllLive<T extends Identifiable>(table: string,params?:JoinQuery): Observable<T[]> {
    const url = `${this.baseUrl}/${table}${environment.use == 'assets' ? '.json' : ''}`;
    const dataSubject = new BehaviorSubject<T[]>(this.dataCache[table] || []); // Subject to hold data
    // Listen to WebSocket updates for the table
    this.wsService.listenToTable(table).subscribe(() => {
      // When a signal is received, trigger the HTTP GET
      this.http.get<T[]>(url,{params: {
        ...params
      }}).subscribe((newData) => {
        this.dataCache[table] = newData; // Cache new data
        dataSubject.next(newData); // Emit new data
      });
    });
    return dataSubject.asObservable();
  }

  // Read (Get by ID)
  async get<T extends Identifiable>(table: string, id: string): Promise<T | undefined> {
    const url = `${this.baseUrl}/${table}/${id}`;
    if (environment.use == 'assets') {
      const dummyData: T[] = await this.getAll(table);
      const item = dummyData.find(i => i.id == id);
      return item;
    } else {
      return firstValueFrom(this.http.get<T>(url));
    }
  }

  // Update
  async update<T extends Identifiable>(table: string, id: string, data: T): Promise<T> {
    if (environment.use == 'assets') {
      const dummyData: T[] = await this.getAll(table);
      const replaceIndex = dummyData.findIndex(i => i.id == id)
      dummyData[replaceIndex] = data;
      return dummyData[replaceIndex];
    } else {
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.put<T>(url, data));
    }
  }

  async partial_update<T extends Identifiable>(table: string, id: string, data: Partial<T>): Promise<T> {
    if (environment.use == 'assets') {
      const dummyData: T[] = await this.getAll(table);
      const replaceIndex = dummyData.findIndex(i => i.id == id)
      dummyData[replaceIndex] = {
        ...dummyData[replaceIndex],
        ...data
      };
      return dummyData[replaceIndex];
    } else {
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.patch<T>(url, data));
    }
  }


  // Delete
  async delete<T extends Identifiable>(table: string, id: string): Promise<T | undefined> {
    const url = `${this.baseUrl}/${table}/${id}`;
    if (environment.use == 'assets') {
      const dummyData: T[] = await this.getAll(table);
      return dummyData.find(i => i.id == id);
    } else {
      return firstValueFrom(this.http.delete<T>(url));
    }
  }
}
