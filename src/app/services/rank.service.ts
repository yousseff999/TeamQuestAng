import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rank } from '../models/rank';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RankService {
  private apiUrl = 'http://localhost:8086/Rank';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Update user rank
  updateUserRank(userId: number): Observable<Rank> {
    return this.http.put<Rank>(`${this.apiUrl}/user/${userId}`, {}, {
      headers: this.getHeaders()
    });
  }

  // Update team rank
  updateTeamRank(teamId: number): Observable<Rank> {
    return this.http.put<Rank>(`${this.apiUrl}/team/${teamId}`, {}, {
      headers: this.getHeaders()
    });
  }

  // Update department rank
  updateDepartmentRank(departmentId: number): Observable<Rank> {
    return this.http.put<Rank>(`${this.apiUrl}/department/${departmentId}`, {}, {
      headers: this.getHeaders()
    });
  }

  // Get user ranks
  getUserRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/users`, {
      headers: this.getHeaders()
    });
  }

  // Get team ranks
  getTeamRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/teams`, {
      headers: this.getHeaders()
    });
  }

  // Delete rank
  deleteRank(rankId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${rankId}`, {
      headers: this.getHeaders()
    });
  }

  // Update rank
  updateRank(entityId: number, rankType: string): Observable<Rank> {
    return this.http.put<Rank>(`${this.apiUrl}/update`, { entityId, rankType }, {
      headers: this.getHeaders()
    });
  }

  // Get leaderboard
  getLeaderboard(type: 'user' | 'team' | 'department'): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/leaderboard/${type}`, {
      headers: this.getHeaders()
    });
  }
}