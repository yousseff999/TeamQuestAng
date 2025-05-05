import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event as MyEvent } from 'src/app/models/event';

@Component({
  selector: 'app-eventcategory',
  templateUrl: './eventcategory.component.html',
  styleUrls: ['./eventcategory.component.css']
})
export class EventcategoryComponent implements OnInit {
  events: MyEvent[] = [];
  selectedCategory: string = '';
  imageUrls: { [eventId: number]: string } = {};

  constructor(private eventService: EventService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.selectedCategory = category;
        this.eventService.showEventsByCategory(category).subscribe({
          next: (data) => {
            this.events = data;
            this.loadImageUrls(); 
          },
          error: (err) => console.error(err)
        });
      }
    });
  }


loadEventsByCategory() {
    this.eventService.showEventsByCategory(this.selectedCategory).subscribe({
      next: (data) => {
        this.events = data;
        this.loadImageUrls(); 
      },
      error: (err) => console.error(err)
    });
  }

  loadImageUrls() {
    this.events.forEach(event => {
      this.eventService.getImageUrlForEventByID(event.eventId).subscribe({
        next: (url) => this.imageUrls[event.eventId] = url,
        error: (err) => console.error(`Error loading image for event ${event.eventId}:`, err)
      });
    });
  }

  updateEvent(eventId: number, updatedEvent: MyEvent) {
    this.eventService.updateEvent(eventId, updatedEvent).subscribe({
      next: (updated) => {
        console.log('Event updated successfully:', updated);
        this.loadEventsByCategory();
      },
      error: (err) => console.error('Error updating event:', err)
    });
  }

  deleteEvent(eventId: number) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        console.log('Event deleted successfully');
        this.loadEventsByCategory();
      },
      error: (err) => console.error('Error deleting event:', err)
    });
  }
}