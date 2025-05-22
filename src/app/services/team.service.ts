import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { Rank } from '../models/rank';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:8086/Team';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create team
  createTeam(team: Team): Observable<Team> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<Team>(`${this.apiUrl}/create`, team, { headers });
  }

  // Get team by ID
  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/getteam/${id}`);
  }

  // Get all teams
  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/getall`);
  }

  // Update team
  updateTeam(id: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/updateteam/${id}`, team);
  }

  // Delete team
  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Add user to team
  addUserToTeam(teamId: number, userId: number): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/add-user/${userId}`, {});
  }
  

  // Remove user from team
  removeUserFromTeam(teamId: number, userId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/members/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getTeamNamesAndScores(): Observable<[string, number][]> {
    return this.http.get<[string, number][]>(`${this.apiUrl}/scores`);
  }

  // Get team rankings
  getTeamRankings(): Observable<Rank[]> {
    return this.http.get<Rank[]>(`${this.apiUrl}/rankings`);
  }
  // Get team by user ID
getTeamByUserId(userId: number): Observable<Team> {
  return this.http.get<Team>(`${this.apiUrl}/teamuser/${userId}`);
}
getTeamCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  getWeeklyPercentageChange(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/weekly-percentage-change`);
  }
  getTopScoringTeam(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-scoring`);
  }   
}