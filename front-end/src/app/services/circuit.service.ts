// circuit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  private apiUrl = 'http://localhost:8080/api/v1/circuits';

  constructor(private http: HttpClient) {}

  // Get all circuits
  getCircuits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a single circuit by ID - FIX THIS METHOD
  getCircuitById(id: number): Observable<any> {
    // Your backend uses /get/{id} endpoint
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }

  // Create new circuit
  createCircuit(circuit: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, circuit);
  }

  // Update circuit
  updateCircuit(id: number, circuit: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, circuit);
  }

  // Delete circuit
  deleteCircuit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  
  }
  // Get circuits count
getCircuitsCount(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count`);
}

}