import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface ICS {
  ics_no: string;
  entity_name: string;
  fund_cluster: string;
  date: Date;
  inventory_item_no: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  description: string;
  estimated_useful_life: string;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class IcsService {
  private apiUrl = `${environment.api}/ics`;

  constructor(private http: HttpClient) {}

  getAllIcs(): Observable<ICS[]> {
    console.log('Fetching from URL:', this.apiUrl); // Debug log
    return this.http.get<ICS[]>(this.apiUrl).pipe(
      tap(data => console.log('Response data:', data)),
      catchError(error => {
        console.error('Error fetching ICS:', error);
        return throwError(() => error);
      })
    );
  }

  createIcs(ics: ICS): Observable<any> {
    return this.http.post(this.apiUrl, ics);
  }

  updateIcs(id: string, ics: ICS): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ics);
  }

  deleteIcs(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 