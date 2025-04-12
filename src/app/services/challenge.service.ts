import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Challenge } from '../models/challenge';
import { Question } from '../models/question';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'http://localhost:8080/Challenge';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create challenge
  createChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http.post<Challenge>(this.apiUrl, challenge, {
      headers: this.getHeaders()
    });
  }

  // Get all challenges
  getAllChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Get challenge by ID
  getChallengeById(id: number): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
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
    return this.http.get<Question[]>(`${this.apiUrl}/generate-questions?difficulty=${difficultyLevel}`, {
      headers: this.getHeaders()
    });
  }

  // Evaluate challenge
  evaluateChallenge(
    questions: Question[],
    userAnswers: string[],
    userId?: number,
    teamId?: number,
    departmentId?: number
  ): Observable<{ score: number }> {
    const body = {
      questions,
      userAnswers,
      userId,
      teamId,
      departmentId
    };

    return this.http.post<{ score: number }>(`${this.apiUrl}/evaluate`, body, {
      headers: this.getHeaders()
    });
  }
}