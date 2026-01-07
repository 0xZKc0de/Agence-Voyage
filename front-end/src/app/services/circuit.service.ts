import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  private apiUrl = 'http://localhost:8080/api/v1/circuits';

  constructor(private http: HttpClient) { }

  // جلب كل الرحلات
  getCircuits(): Observable<any[]> {
    // التعديل الضروري هنا: إضافة withCredentials
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  // جلب رحلة واحدة بالتفصيل
  getCircuitById(id: number): Observable<any> {
    // أضف كلمة get في الرابط
    return this.http.get<any>(`${this.apiUrl}/get/${id}`, { withCredentials: true });
  }
}
