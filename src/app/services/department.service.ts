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
  private apiUrl = 'http://localhost:8086/Department';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create department
  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/create`, department);
  }

  // Get all departments
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/getall`);
  }

  // Get department by ID
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  // Update department
  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/update/${id}`, department);
  }

  // Delete department
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Get department rankings
  getDepartmentRankings(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/rankings`);
  }
  // Add user to team
// Add a user to a department
addUserToDepartment(departmentId: number, userId: number): Observable<Department> {
  return this.http.put<Department>(
    `${this.apiUrl}/${departmentId}/addUser/${userId}`,
    {}
  );
}

// Remove a user from a department
removeUserFromDepartment(departmentId: number, userId: number): Observable<Department> {
  return this.http.put<Department>(
    `${this.apiUrl}/${departmentId}/removeUser/${userId}`,
    {}
  );
}
// Get users by department ID
getUsersByDepartment(departmentId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/${departmentId}/users`
  );
}
 getDepartmentNamesAndScores(): Observable<[string, number][]> {
    return this.http.get<[string, number][]>(`${this.apiUrl}/names-scores`);
  }
getDepartmentCount(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count`);
}
}