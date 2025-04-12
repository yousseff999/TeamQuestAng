import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { AuthService } from './auth.service';
import { Rank } from '../models/rank';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8080/Department';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create department
  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department, {
      headers: this.getHeaders()
    });
  }

  // Get all departments
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Get department by ID
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Update department
  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, department, {
      headers: this.getHeaders()
    });
  }

  // Delete department
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Get department rankings
  getDepartmentRankings(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/rankings`, {
      headers: this.getHeaders()
    });
  }
}