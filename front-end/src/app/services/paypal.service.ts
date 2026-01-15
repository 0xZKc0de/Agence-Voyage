import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private apiUrl = 'http://localhost:8080/api/paypal';

  constructor(private http: HttpClient) {}

  createPayment(reservationId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/create/${reservationId}`, {}, {
      responseType: 'text',
      withCredentials: true
    });
  }



  capturePayment(orderId: string, reservationId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/capture/${orderId}/${reservationId}`,
      {},
      {
        withCredentials: true,
        responseType: 'text'
      }
    );
  }
}
