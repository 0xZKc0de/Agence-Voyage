import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// client.service.ts
export interface ClientData {
  id?: number;                 // only for list of clients
  firstName: string;
  lastName: string;
  email?: string;              // only for list of clients
  phone?: string;              // only for list of clients
  reservationsCount: number;   // both for top and list
  totalAmount?: number;        // only for top clients
}




@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  // All clients
  getAllClients(): Observable<ClientData[]> {
    return this.http.get<ClientData[]>(this.apiUrl); 
  }

  // Top clients
  getTopClients(limit: number = 5): Observable<ClientData[]> {
    return this.http.get<ClientData[]>(`${this.apiUrl}/top?limit=${limit}`);
  }

  getClientsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { withCredentials: true });
}

}
