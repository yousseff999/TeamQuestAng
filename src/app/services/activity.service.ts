import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:8080/Activity';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create activity with image
  addActivityWithImage(activity: Activity, activityImage: File, eventId: number): Observable<Activity> {
    const formData = new FormData();
    formData.append('activity', JSON.stringify(activity));
    formData.append('activityImage', activityImage);
    formData.append('eventId', eventId.toString());

    return this.http.post<Activity>(`${this.apiUrl}/with-image`, formData, {
      headers: this.getHeaders()
    });
  }

  // Update activity image
  updateActivityImage(activityID: number, activityImage: File): Observable<Activity> {
    const formData = new FormData();
    formData.append('activityImage', activityImage);

    return this.http.put<Activity>(`${this.apiUrl}/${activityID}/image`, formData, {
      headers: this.getHeaders()
    });
  }

  // Get image URL
  getImageUrlForActivityByID(activityID: number): Observable<{ imageUrl: string }> {
    return this.http.get<{ imageUrl: string }>(`${this.apiUrl}/${activityID}/image-url`, {
      headers: this.getHeaders()
    });
  }

  // Get all activities
  getAllActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Get open activities
  getOpenActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/open`, {
      headers: this.getHeaders()
    });
  }

  // Search activities by name
  searchActivityByName(activityName: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/search?name=${activityName}`, {
      headers: this.getHeaders()
    });
  }

  // Search activities by start date
  searchActivityByStartDate(startDate: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/search-by-date?date=${startDate}`, {
      headers: this.getHeaders()
    });
  }

  // Register user to activity
  registerUserToActivity(userId: number, activityId: number, eventId: number): Observable<Activity> {
    return this.http.post<Activity>(
      `${this.apiUrl}/${activityId}/register`,
      { userId, eventId },
      { headers: this.getHeaders() }
    );
  }

  // Get users by activity
  getUsersByActivity(activityId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${activityId}/users`, {
      headers: this.getHeaders()
    });
  }

  // Delete activity
  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}