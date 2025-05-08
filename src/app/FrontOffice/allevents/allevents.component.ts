import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionType } from 'src/app/models/event-interaction'; // Adjust path as needed

@Component({
  selector: 'app-allevents',
  templateUrl: './allevents.component.html',
  styleUrls: ['./allevents.component.css']
})
export class AlleventsComponent implements OnInit {
  events: Event[] = [];
  currentUserId: number | null = null;
  InteractionType = InteractionType;
  // ✅ Dictionnaire des URLs d'images par ID d'événement
  eventImageUrls: { [eventId: number]: string } = {};

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.currentUserId = parseInt(userId, 10);
    }
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;

        // ✅ Charger les URLs d’images pour chaque événement
        this.events.forEach(event => {
          this.getImageUrl(event.eventId);
        });
      },
      error: (err) => console.error('Failed to load events:', err)
    });
  }

  getImageUrl(eventId: number): void {
    this.eventService.getImageUrlForEventByID(eventId).subscribe({
      next: (url) => this.eventImageUrls[eventId] = url,
      error: (err) => console.error('Failed to get image URL:', err)
    });
  }

  addUser(eventId: number): void {
    if (!this.currentUserId) return;
    this.eventService.addUserToEvent(eventId, this.currentUserId).subscribe({
      next: () => console.log('User added to event'),
      error: (err) => console.error('Failed to add user to event:', err)
    });
  }

  interact(eventId: number, type: InteractionType): void {
    if (!this.currentUserId) return;
    this.eventService.recordInteraction(this.currentUserId, eventId, type).subscribe({
      next: () => console.log(`Interaction recorded: ${type}`),
      error: (err) => console.error('Interaction failed:', err)
    });
  }
}
