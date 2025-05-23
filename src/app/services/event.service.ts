import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';
import { EventInteraction } from '../models/event-interaction';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { Event as MyEvent } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8086/Event';
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Helper method to get headers with Authorization token
 // Helper method to get headers with Authorization token
 private getHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });
}


  // Get all events (added the method you requested)
  /*getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/all`); // No headers needed
}*/

  // Create event
  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/add`, event);
  }

  // Update event
  updateEvent(eventId: number, updatedEvent: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/update/${eventId}`, updatedEvent); 
  }

  // Delete event
  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${eventId}`);
  }

  // Get event by ID
  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/getevent/${eventId}`);
  }

  // Get events by category
  showEventsByCategory(category: string): Observable<MyEvent[]> {
    return this.http.get<MyEvent[]>(`${this.apiUrl}/category/${category}`);
  }

  // Get all events
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/all`);
  }

  // Add user to event
  addUserToEvent(eventId: number, userId: number): Observable<Event> {
    return this.http.post<Event>(
      `${this.apiUrl}/${eventId}/addUser/${userId}`,
      {}
    );
  }

  removeUserFromEvent(eventId: number, userId: number): Observable<Event> {
    return this.http.delete<Event>(`${this.apiUrl}/${eventId}/users/${userId}`);
  }
  

  // Get event users
  showEventUsers(eventId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${eventId}/users`);
  }

  // Update event image
  updateEventImage(idEvent: number, eventImage: File): Observable<Event> {
    const formData = new FormData();
    formData.append('eventImage', eventImage);

    return this.http.put<Event>(`${this.apiUrl}/${idEvent}/upload-image`, formData);
  }

  // Get image URL for event
  getImageUrlForEventByID(idEvent: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${idEvent}/image-url`, { responseType: 'text' });
}

  // Record interaction
  recordInteraction(userId: number, eventId: number, interactionType: string): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('interactionType', interactionType);
  
    return this.http.post(
      `${this.apiUrl}/${eventId}/interact`,
      {}, // empty body
      { params, responseType: 'text' } // 👈 Tell Angular to expect plain text
    );
  }
  

  // Get user interactions
  getUserInteractions(userId: number): Observable<EventInteraction[]> {
    return this.http.get<EventInteraction[]>(`${this.apiUrl}/user/${userId}/interactions`);
  }

  // Get event interactions
  getEventInteractions(eventId: number): Observable<EventInteraction[]> {
    return this.http.get<EventInteraction[]>(`${this.apiUrl}/${eventId}/interactions`);
  }
  getUniqueParticipantsCount(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/participants/count`);
}
 getTotalUserParticipations(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-participations`);
  }
}
