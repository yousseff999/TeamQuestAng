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
  private apiUrl = 'http://localhost:8086/Activity';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Create activity with image
  addActivityWithImage(activity: Activity, activityImage: File, eventId: number): Observable<Activity> {
    const formData = new FormData();
    formData.append('activityName', activity.activityName);
    formData.append('description', activity.description);
    formData.append('startDate', activity.startDate.toString());
    formData.append('endDate', activity.endDate.toString());
    formData.append('maxParticipants', activity.maxParticipants.toString());
    formData.append('eventId', eventId.toString());
    formData.append('activityImage', activityImage);

    return this.http.post<Activity>(`${this.apiUrl}/add`, formData);
  }

  // Update activity image
  updateActivityImage(activityID: number, activityImage: File): Observable<Activity> {
    const formData = new FormData();
    formData.append('image', activityImage);

    return this.http.post<Activity>(`${this.apiUrl}/${activityID}/uploadImage`, formData);
  }

  updateActivity(activityID: number, updatedActivity: any): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${activityID}/update`, updatedActivity);
  }
  
  getActivityById(activityID: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${activityID}`);
  }
  

  // Get image URL
  getImageUrlForActivityByID(activityID: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${activityID}/image`, { responseType: 'text' });
  }

  // Get all activities
  getAllActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/all`);
  }

  // Get open activities
  getOpenActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/show_open`);
  }

  // Search activities by name
  searchActivityByName(activityName: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/searchByName?name=${activityName}`);
  }

  // Search activities by start date
  searchActivityByStartDate(startDate: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/searchByStartDate?startdate=${startDate}`);
  }

  // Register user to activity
 registerUserToActivity(userId: number, activityId: number, eventId: number) {
  const url = `${this.apiUrl}/registerUserToActivity/${activityId}/register/${userId}/event/${eventId}`;
  return this.http.post(url, null, { responseType: 'text' });
}


  // Get users by activity
  getUsersByActivity(activityId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${activityId}/users`);
  }

  // Delete activity
  deleteActivity(id: number, options?: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, options);
  }
  getActivitiesByEventId(eventId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/by-event/${eventId}`);
  }
}