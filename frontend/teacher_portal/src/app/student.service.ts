// src/app/services/student.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000';  // Replace with your backend API URL
  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token:', token);  // Log the token for debugging
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  addStudent(studentData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/teacher/addstudent`, studentData, { headers });
  }
  getAllStudents(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/teacher/students`, { headers });
  }
  getStudentByRollno(rollno: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/teacher/student/${rollno}`, { headers });
  }
  updateStudent(rollno: string, studentData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/teacher/student/${rollno}`, studentData, { headers });
  }
  deleteStudent(rollno: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/teacher/student/${rollno}`, { headers });
  }
}

