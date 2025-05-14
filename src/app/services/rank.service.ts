import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.put<Rank>(`${this.apiUrl}/update/user/${userId}`, {});
  }

  // Update team rank
  updateTeamRank(teamId: number): Observable<Rank> {
    return this.http.put<Rank>(`${this.apiUrl}/update/team/${teamId}`, {});
  }

  // Update department rank
  updateDepartmentRank(departmentId: number): Observable<Rank> {
    return this.http.put<Rank>(`${this.apiUrl}/department/${departmentId}`, {});
  }

  // Get user ranks
  getUserRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/users`);
  }

  // Get team ranks
  getTeamRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/teams`);
  }

  // Delete rank
  deleteRank(rankId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${rankId}`);
  }

  // Update rank
 updateRank(entityId: number, rankType: 'INDIVIDUAL' | 'TEAM' | 'DEPARTMENT') {
  const params = new HttpParams()
    .set('entityId', entityId.toString())
    .set('rankType', rankType);

  return this.http.put(`${this.apiUrl}/update`, null, { params });
}


  // Get leaderboard
  getLeaderboard(type: 'user' | 'team' | 'department'): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/leaderboard/${type}`);
  }
}