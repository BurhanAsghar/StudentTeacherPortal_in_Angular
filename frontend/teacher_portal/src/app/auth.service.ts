import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';  // Replace with your backend API URL
   constructor(private http: HttpClient, private router: Router) {}
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('teacherName', response.username);
        }
      })
    );
  }
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('teacherName', response.username);
        }
      })
    );
  }
  getTeacherName(): string {
    return localStorage.getItem('teacherName') || '';
  }
  logout(): any {
    localStorage.removeItem('token');
    localStorage.removeItem('teacherName');
    this.router.navigate(['/login']);  // Redirect to login page after logout
  }
}

