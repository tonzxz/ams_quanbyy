import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

interface Identifiable {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {

  private baseUrl = environment.use == 'assets' ? '/assets/dummy' : environment.api; // Replace with your API base URL

  constructor(private http: HttpClient) { }

  // Create
  async create<T extends Identifiable>(table: string, data: T): Promise<T> {
    const url = `${this.baseUrl}/${table}`;
    if(environment.use == 'assets'){
      const dummyData: T[] =  await this.getAll(table);
      dummyData.push(data);
      return data;
    }else{
      return firstValueFrom(this.http.post<T>(url, data));
    }
  }

  // Read (Get all records)
  async getAll<T extends Identifiable>(table: string): Promise<T[]> {
    const url = `${this.baseUrl}/${table}${environment.use == 'assets'? '.json':''}`;
    return firstValueFrom(this.http.get<T[]>(url));
  }

  // Read (Get by ID)
  async get<T extends Identifiable>(table: string, id: string): Promise<T|undefined> {
    const url = `${this.baseUrl}/${table}/${id}`;
    if(environment.use == 'assets'){
      const dummyData:T[] =  await this.getAll(table);
      const item = dummyData.find(i=>i.id ==id);
      return item;
    }else{
      return firstValueFrom(this.http.get<T>(url));
    }
  }

  // Update
  async update<T extends Identifiable>(table: string, id: string, data: T): Promise<T> {
    if(environment.use == 'assets'){
      const dummyData: T[] =  await this.getAll(table);
      const replaceIndex = dummyData.findIndex(i=>i.id == id)
      dummyData[replaceIndex] = data;
      return dummyData[replaceIndex];
    }else{
      const url = `${this.baseUrl}/${table}/${id}`;
      return firstValueFrom(this.http.put<T>(url, data));
    }
  }

  async partial_update<T extends Identifiable>(table: string, id: string, patch:string ,data: Partial<T>): Promise<T> {
    if(environment.use == 'assets'){
      const dummyData: T[] =  await this.getAll(table);
      const replaceIndex = dummyData.findIndex(i=>i.id == id)
      dummyData[replaceIndex] = {
        ...dummyData[replaceIndex],
        ...data
      };
      return dummyData[replaceIndex];
    }else{
      const url = `${this.baseUrl}/${table}/${id}/${patch}`;
      return firstValueFrom(this.http.patch<T>(url, data));
    }
  }


  // Delete
  async delete<T extends Identifiable>(table: string, id: string): Promise<T|undefined> {
    const url = `${this.baseUrl}/${table}/${id}`;
    if(environment.use == 'assets'){
      const dummyData: T[] =  await this.getAll(table);
      return dummyData.find(i=>i.id == id);
    }else{
      return firstValueFrom(this.http.delete<T>(url));
    }
  }
}
