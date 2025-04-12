import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';
import { EventInteraction } from '../models/event-interaction';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8086/Event';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Get all events (added the method you requested)
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/all`); // No headers needed
}

  // Create event
  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event, {
      headers: this.getHeaders()
    });
  }

  // Update event
  updateEvent(eventId: number, updatedEvent: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${eventId}`, updatedEvent, {
      headers: this.getHeaders()
    });
  }

  // Delete event
  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`, {
      headers: this.getHeaders()
    });
  }

  // Get event by ID
  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${eventId}`, {
      headers: this.getHeaders()
    });
  }

  // Get events by category
  showEventsByCategory(category: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/category/${category}`, {
      headers: this.getHeaders()
    });
  }

  // Get all events
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Add user to event
  addUserToEvent(eventId: number, userId: number): Observable<Event> {
    return this.http.post<Event>(
      `${this.apiUrl}/${eventId}/register`,
      { userId },
      { headers: this.getHeaders() }
    );
  }

  // Get event users
  showEventUsers(eventId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${eventId}/users`, {
      headers: this.getHeaders()
    });
  }

  // Update event image
  updateEventImage(idEvent: number, eventImage: File): Observable<Event> {
    const formData = new FormData();
    formData.append('eventImage', eventImage);

    return this.http.put<Event>(`${this.apiUrl}/${idEvent}/image`, formData, {
      headers: this.getHeaders()
    });
  }

  // Get image URL for event
  getImageUrlForEventByID(idEvent: number): Observable<{ imageUrl: string }> {
    return this.http.get<{ imageUrl: string }>(`${this.apiUrl}/${idEvent}/image-url`, {
      headers: this.getHeaders()
    });
  }

  // Record interaction
  recordInteraction(userId: number, eventId: number, interactionType: string): Observable<EventInteraction> {
    return this.http.post<EventInteraction>(
      `${this.apiUrl}/${eventId}/interactions`,
      { userId, interactionType },
      { headers: this.getHeaders() }
    );
  }

  // Get user interactions
  getUserInteractions(userId: number): Observable<EventInteraction[]> {
    return this.http.get<EventInteraction[]>(`${this.apiUrl}/user/${userId}/interactions`, {
      headers: this.getHeaders()
    });
  }

  // Get event interactions
  getEventInteractions(eventId: number): Observable<EventInteraction[]> {
    return this.http.get<EventInteraction[]>(`${this.apiUrl}/${eventId}/interactions`, {
      headers: this.getHeaders()
    });
  }
}
