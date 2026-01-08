import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
    }).pipe(
      tap(data => console.log('API Response:', data)), // Log response
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  getReservationsCount() {
    return this.http.get<number>(
      `${this.apiUrl}/count`,
    );
  }
}