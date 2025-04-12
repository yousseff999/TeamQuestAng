import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event, TypeEvent } from 'src/app/models/event';

@Component({
  selector: 'app-showevent',
  templateUrl: './showevent.component.html',
  styleUrls: ['./showevent.component.css']
})
export class ShoweventComponent implements OnInit {

  events: Event[] = [];
  event: Event = {} as Event;
  eventTypeEnum = TypeEvent;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  // Load all events
  loadEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    }, error => {
      console.error('Error fetching events:', error);
    });
  }

  // Add a new event
  addEvent(event: Event): void {
    this.eventService.addEvent(event).subscribe((newEvent) => {
      this.events.push(newEvent);
    });
  }

  // Update an event
  updateEvent(eventId: number, updatedEvent: Event): void {
    this.eventService.updateEvent(eventId, updatedEvent).subscribe(() => {
      this.loadEvents();
    });
  }

  // Delete an event
  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.loadEvents();
    });
  }

  // Get event details
  getEventDetails(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe((event) => {
      this.event = event;
    });
  }

  // Get events by category
  getEventsByCategory(category: TypeEvent): void {
    this.eventService.showEventsByCategory(category).subscribe((events) => {
      this.events = events;
    });
  }

  // Add user to event
  addUserToEvent(eventId: number, userId: number): void {
    this.eventService.addUserToEvent(eventId, userId).subscribe((event) => {
      console.log('User added to event', event);
    });
  }
}
