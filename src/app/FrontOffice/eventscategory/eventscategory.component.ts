import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event as MyEvent } from 'src/app/models/event';
import { InteractionType } from 'src/app/models/event-interaction';
import { MatDialog } from '@angular/material/dialog';
import { MapDialogComponent } from 'src/app/map-dialog/map-dialog.component';

@Component({
  selector: 'app-eventscategory',
  templateUrl: './eventscategory.component.html',
  styleUrls: ['./eventscategory.component.css']
})
export class EventscategoryComponent implements OnInit {
  events: MyEvent[] = [];
  selectedCategory: string = '';
  imageUrls: { [eventId: number]: string } = {};
  currentUserId: number | null = null;
  InteractionType = InteractionType;

  constructor(private eventService: EventService, private route: ActivatedRoute,private router : Router, private dialog: MatDialog) {}
openMap(location: string): void {
    this.dialog.open(MapDialogComponent, {
      width: '500px',
      data: location
    });
  }
  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.currentUserId = parseInt(storedUserId, 10);
    } else {
      console.warn("No user ID found in localStorage");
    }

    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.selectedCategory = category;
        this.loadEventsByCategory();
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

  addUser(eventId: number): void {
    if (!this.currentUserId) {
      console.warn("User not logged in. Cannot add to event.");
      return;
    }
    this.eventService.addUserToEvent(eventId, this.currentUserId).subscribe({
      next: () => console.log(`User ${this.currentUserId} added to event ${eventId}`),
      error: (err) => console.error('Failed to add user to event:', err)
    });
  }

  interact(eventId: number, type: InteractionType): void {
    if (!this.currentUserId) {
      console.warn("User not logged in. Cannot interact.");
      return;
    }
    this.eventService.recordInteraction(this.currentUserId, eventId, type).subscribe({
      next: () => console.log(`Interaction recorded: ${type} for event ${eventId}`),
      error: (err) => console.error('Interaction failed:', err)
    });
  }

  handleInteraction(
    clickedBtn: HTMLButtonElement, 
    otherBtn1: HTMLButtonElement, 
    otherBtn2: HTMLButtonElement,
    eventId: number,
    interactionType: InteractionType
  ) {
    const typeClass = clickedBtn.classList.contains('like-btn') ? 'pink' :
                      clickedBtn.classList.contains('dislike-btn') ? 'red' : 'blue';

    if (clickedBtn.classList.contains('bg-gray-200')) {
      // Activate clicked button
      clickedBtn.classList.remove('bg-gray-200', `text-${typeClass}-500`);
      clickedBtn.classList.add(`bg-${typeClass}-500`, 'text-white');

      // Reset others
      [otherBtn1, otherBtn2].forEach(btn => {
        const cls = btn.classList.contains('like-btn') ? 'pink' :
                    btn.classList.contains('dislike-btn') ? 'red' : 'blue';
        btn.classList.remove(`bg-${cls}-500`, 'text-white');
        btn.classList.add('bg-gray-200', `text-${cls}-500`);
      });

      this.interact(eventId, interactionType);
    } else {
      // Deactivate clicked again
      clickedBtn.classList.add('bg-gray-200', `text-${typeClass}-500`);
      clickedBtn.classList.remove(`bg-${typeClass}-500`, 'text-white');
    }
  }
  viewActivities(eventId: number) {
  this.router.navigate(['/activities-in-event'], { 
    state: { eventId: eventId }  
  });
}
scrollTo(id: string, event: Event) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  navigateToCategory(category: string) {
  this.router.navigate(['/eventscategory', category]);
}
}
