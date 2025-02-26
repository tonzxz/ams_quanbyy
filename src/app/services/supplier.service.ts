import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Supplier {
  id?: string;
  name: string;
  contact_person?: string;
  contact_number?: string;
  email?: string;
  address?: string;
  description?: string;
  tin_number?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.api}/suppliers`;

  constructor(private http: HttpClient) {}

  getAllSuppliers(): Observable<Supplier[]> {
    console.log('Fetching suppliers from URL:', this.apiUrl);
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      tap(data => console.log('Response data:', data)),
      catchError(error => {
        console.error('Error fetching suppliers:', error);
        return throwError(() => error);
      })
    );
  }

  getSupplierById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching supplier with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  createSupplier(supplier: Supplier): Observable<any> {
    return this.http.post(this.apiUrl, supplier).pipe(
      catchError(error => {
        console.error('Error creating supplier:', error);
        return throwError(() => error);
      })
    );
  }

  updateSupplier(id: string, supplier: Supplier): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, supplier).pipe(
      catchError(error => {
        console.error(`Error updating supplier with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting supplier with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
} 