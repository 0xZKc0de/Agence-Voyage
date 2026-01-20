import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  private apiUrl = 'http://localhost:8080/api/v1/circuits';
  private _refreshNeeded$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  // هذه للكلاينت (Pagination)
  getAllCircuits(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  // 🔥 هذه للأدمن (بدون Pagination)
  getAllCircuitsList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getCircuitById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }

  createCircuit(circuit: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, circuit).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  updateCircuit(id: number, circuit: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, circuit).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  deleteCircuit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  getCircuitsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
