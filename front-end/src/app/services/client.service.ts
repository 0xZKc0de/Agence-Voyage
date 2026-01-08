import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientService {
    private apiUrl = 'http://localhost:8080/api/clients';

    constructor(private http: HttpClient) {}

    getClientsCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count`);
    }

    getTopClients(limit: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/top?limit=${limit}`);
    }
}
