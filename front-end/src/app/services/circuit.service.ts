import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  private apiUrl = 'http://localhost:8080/api/v1/circuits'; // رابط الـ API الخاص بك

  constructor(private http: HttpClient) { }

  getCircuits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
