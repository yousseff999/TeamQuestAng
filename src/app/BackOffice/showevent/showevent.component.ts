import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event, TypeEvent } from 'src/app/models/event';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MapDialogComponent } from 'src/app/map-dialog/map-dialog.component';
interface NominatimResponse {
  lat: string;
  lon: string;
}
@Component({
  selector: 'app-showevent',
  templateUrl: './showevent.component.html',
  styleUrls: ['./showevent.component.css']
})
export class ShoweventComponent implements OnInit {
  events: Event[] = [];
  eventTypeEnum = TypeEvent;
  isCardView: boolean = true;
  constructor(private eventService: EventService,private router: Router,private location: Location,private dialog: MatDialog) { }
  openMap(location: string): void {
    this.dialog.open(MapDialogComponent, {
      width: '500px',
      data: location
    });
  }
  toggleView(): void {
    this.isCardView = !this.isCardView;
  }
  ngOnInit(): void {
    this.loadEvents();
  }
  goBack(): void {
    this.router.navigate(['/admin']); 
  }
  
    loadEvents(): void {
      this.eventService.getAllEvents().subscribe((data: Event[]) => {
        this.events = data;
        console.log('data',data);
        this.events.forEach(event => {
          if (event.eventId) {  // if your Event entity has 'id' called differently, replace 'reclamationID' by the correct id
            this.eventService.getImageUrlForEventByID(event.eventId).subscribe({
              next: (url: string) => {
                event.eventImage = url;
              },
              error: (err) => {
                console.error(`Failed to load image for event ID ${event.eventId}`, err);
              }
            });
          }
        });
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
    this.router.navigate(['/event/update'], { state: { eventId } });
localStorage.setItem('eventId', eventId.toString());
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
  addActivity(event: Event): void {
  localStorage.setItem('selectedEvent', JSON.stringify(event));
  this.router.navigate(['/addactivity']);
}

}
