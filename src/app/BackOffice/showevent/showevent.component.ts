import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event, TypeEvent } from 'src/app/models/event';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-showevent',
  templateUrl: './showevent.component.html',
  styleUrls: ['./showevent.component.css']
})
export class ShoweventComponent implements OnInit {
  events: Event[] = [];
  eventTypeEnum = TypeEvent;
  
  constructor(private eventService: EventService,private router: Router,private location: Location) { }

  ngOnInit(): void {
    this.loadEvents();
  }
  goBack() {
    this.location.back();
  }
  
    loadEvents(): void {
      this.eventService.getAllEvents().subscribe((data: Event[]) => {
        this.events = data;
        console.log('data',data);
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
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.loadEvents(); // Refresh the event list after deletion
      },
      error: (err) => {
        console.error('Error deleting event:', err);
      }
    });
  }

  // Get event details
  getEventDetails(eventId: number): void {
    this.router.navigate(['/event/update', eventId]);
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
