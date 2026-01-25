import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // منطق استرجاع المستخدم عند تحديث الصفحة
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          console.error('Erreur parsing utilisateur stocké', e);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData);
  }
  // =========================================================

  login(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        })
      );
  }

  checkSession(): Observable<User | null> {
    return this.http.get<User>(`${this.clientUrl}/profile`, { withCredentials: true })
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        }),
        catchError(() => {
          this.currentUserSubject.next(null);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
          }
          return of(null);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentUser');
        }
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentUser');
        }
        return of(null);
      })
    );
  }
}
