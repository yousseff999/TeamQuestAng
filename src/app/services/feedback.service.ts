import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8086/Feedback';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }
sendContactForm(contact: any) {
    return this.http.post('http://localhost:8086/Feedback/sendemail', contact);
  }
  // Add feedback
  addFeedback(eventId: number, userId: number, feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(
      `${this.apiUrl}`,
      { eventId, userId, feedback },
      { headers: this.getHeaders() }
    );
  }

  // Get feedbacks by event
  getFeedbacksByEvent(eventId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/event/${eventId}`, {
      headers: this.getHeaders()
    });
  }

  // Update feedback
  updateFeedback(feedbackId: number, newFeedback: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/${feedbackId}`, newFeedback, {
      headers: this.getHeaders()
    });
  }

  // Delete feedback
  deleteFeedback(feedbackId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${feedbackId}`, {
      headers: this.getHeaders()
    });
  }

  // Get all feedbacks
  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }
}