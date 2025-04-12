import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { Rank } from '../models/rank';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8086/User';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getHeaders()
    });
  }

  // Update user
  updateUser(id: number, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updatedUser, {
      headers: this.getHeaders()
    });
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Assign role to user
  assignRoleToUser(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/role`, { role }, {
      headers: this.getHeaders()
    });
  }

  // Get users by role
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`, {
      headers: this.getHeaders()
    });
  }

  // Search users
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?query=${query}`, {
      headers: this.getHeaders()
    });
  }

  // Count users by role
  countUsersByRole(role: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count?role=${role}`, {
      headers: this.getHeaders()
    });
  }

  // Get user rankings
  getUserRankings(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/rankings`, {
      headers: this.getHeaders()
    });
  }

  // Update user score
  updateUserScore(userId: number, score: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/score`, { score }, {
      headers: this.getHeaders()
    });
  }
}