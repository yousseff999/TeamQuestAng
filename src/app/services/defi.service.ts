// src/app/services/defi.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Defi } from '../models/defi'
import { Submission } from '../models/Submission';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class DefiService {
  private apiUrl = 'http://localhost:8086/Defi';

  constructor(private http: HttpClient) { }

  // Create a new Defi
  createDefi(defi: Defi): Observable<Defi> {
    return this.http.post<Defi>(`${this.apiUrl}/create`, defi);
  }

  // Get all Defis
  getAllDefis(): Observable<Defi[]> {
    return this.http.get<Defi[]>(`${this.apiUrl}/getall`);
  }

  // Get the last created Defi
  getLastCreatedDefi(): Observable<Defi> {
    return this.http.get<Defi>(`${this.apiUrl}/last`);
  }

  // Submit to the latest Defi
submitToLatestDefi(teamId: number, content: string): Observable<any> {
  const params = { teamId: teamId.toString(), content };
  return this.http.post(`${this.apiUrl}/submit-to-latest`, null, { params });
}
// Check if team submitted the latest defi
hasTeamSubmittedToDefi(teamId: number, defiId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/check-submission`, {
    params: { teamId: teamId.toString(), defiId: defiId.toString() }
  });
}
searchDefisByKeyword(keyword: string) {
  return this.http.get<Defi[]>(`${this.apiUrl}/search?keyword=${keyword}`);
}
getSubmissionsByDefiId(defiId: number) {
  return this.http.get<any[]>(`${this.apiUrl}/submissions/${defiId}`);
}
addScoreToTeam(teamId: number, score: number): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/score`, null, {
        params: { 
            teamId: teamId.toString(), 
            score: score.toString() 
        }
    });
}
}