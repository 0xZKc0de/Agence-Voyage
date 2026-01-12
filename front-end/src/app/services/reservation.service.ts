import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  // --- GET METHODS ---

  // Fetches ALL reservations (Mostly for Admin)
  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  // Fetches reservations ONLY for the currently logged-in client
  // Important: Relies on the session/cookie to identify the user
  getMyReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-reservations`, { withCredentials: true });
  }

  // Gets the total count of reservations (For Dashboard)
  getReservationsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // --- ACTION METHODS ---

  // Creates a new reservation
  // Matches: @PostMapping("/create") in Controller
  initiateReservation(reservationRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, reservationRequest, { withCredentials: true });
  }

  // Cancels a specific reservation
  // Matches: @PutMapping("/{id}/cancel") in Controller
  cancelReservation(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, {}, { withCredentials: true });
  }

  // Updates an existing reservation (Optional)
  updateReservation(id: number, reservationRequest: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/update`, reservationRequest, { withCredentials: true });
  }
}
