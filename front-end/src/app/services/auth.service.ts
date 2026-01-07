import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/api/auth';
  private clientUrl = 'http://localhost:8080/api/clients';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }

  checkSession(): Observable<User | null> {
    return this.http.get<User>(`${this.clientUrl}/profile`, { withCredentials: true })
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(() => {
          this.currentUserSubject.next(null);
          return of(null);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.currentUserSubject.next(null))
      );
  }
}
