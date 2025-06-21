import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Challenge } from '../models/challenge';
import { Question } from '../models/question';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'http://localhost:8086/Challenge';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create challenge
  createChallenge(challenge: Challenge): Observable<Challenge> {
    const params = new HttpParams()
      .set('creatorId', challenge.creatorId)
      .set('opponentId', challenge.opponentId);

    const payload = {
      title: challenge.title,
      description: challenge.description
    };

    return this.http.post<Challenge>(`${this.apiUrl}/create`, payload, { params });
  }


  
  // Get all challenges
  getAllChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Get challenge by ID
getChallengeById(id: number) {
  return this.http.get<Challenge>(`${this.apiUrl}/${id}`);
}

  // Update challenge
  updateChallenge(id: number, challenge: Challenge): Observable<Challenge> {
    return this.http.put<Challenge>(`${this.apiUrl}/${id}`, challenge, {
      headers: this.getHeaders()
    });
  }

  // Delete challenge
  deleteChallenge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Generate questions
  generateQuestions(difficultyLevel: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/get_questions?difficultyLevel=${difficultyLevel}`);
  }

  // Evaluate challenge
  evaluateChallenge(questions: Question[], userAnswers: string[]): Observable<any> {
    const payload = {
      questions,
      userAnswers
    };

    return this.http.post<{ score: number }>(`${this.apiUrl}/evaluate`, payload);
  }
  // Update the score of user/team/department
updateScore(score: number, userId?: number, teamId?: number, departmentId?: number): Observable<any> {
  let params: any = { score };

  if (userId) {
    params.userId = userId;
  } else if (teamId) {
    params.teamId = teamId;
  } else if (departmentId) {
    params.departmentId = departmentId;
  } else {
    throw new Error('You must provide a userId, teamId, or departmentId.');
  }

  return this.http.put(`${this.apiUrl}/updateScore`, null, { params });
}

}