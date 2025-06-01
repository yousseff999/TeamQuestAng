import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { Rank } from '../models/rank';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
    return this.http.post<User>(this.apiUrl, user);
  }

  // Update user
  updateUser(id: number, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updatedUser);
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getuser/${id}`);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getallusers`);
  }

  // Delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Assign role to user
  assignRoleToUser(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/assign-role`, { role });
  }
  

  // Get users by role
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  // Search users
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?query=${query}`);
  }

  // Count users by role
  countUsersByRole(role: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count?role=${role}`);
  }

  // Get user rankings
  getUserRankings(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/rankings`);
  }

  // Update user score
  updateUserScore(userId: number, score: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/score`, { score });
  }

  getUsersByScoreDesc(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-scores`);
  }
  
  getTopScorer(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/top-scorer`);
  }
  updateScore(score: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-score`, null, { params: { score: score.toString() } });
  }
  //add the score of the game
  updateScore_u(userId: number, scoreToAdd: number): Observable<string> {
    const url = `${this.apiUrl}/${userId}/score`;
    return this.http.put(url, null, {
      params: { scoreToAdd: scoreToAdd.toString() },
      responseType: 'text'
    });
  }
   countUsers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  getMostEngagedUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/most-engaged`);
  }

  getLeastEngagedUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/least-engaged`);
  }

  getUsersByEngagement(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/engagement-ranking`);
  }
  
}