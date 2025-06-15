import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionType } from 'src/app/models/event-interaction'; // Adjust path as needed
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MapDialogComponent } from 'src/app/map-dialog/map-dialog.component';
@Component({
  selector: 'app-allevents',
  templateUrl: './allevents.component.html',
  styleUrls: ['./allevents.component.css']
})
export class AlleventsComponent implements OnInit {
  events: Event[] = [];
  currentUserId: number | null = null;
  InteractionType = InteractionType;
  eventImageUrls: { [eventId: number]: string } = {};

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router : Router, 
    private dialog: MatDialog
  ) {}
openMap(location: string): void {
    this.dialog.open(MapDialogComponent, {
      width: '500px',
      data: location
    });
  }
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
    next: () => {
      console.log('User added to event');
      alert('You have joined the event successfully!');
    },
    error: (err) => {
      console.error('Failed to add user to event:', err);
      alert('Failed to join the event. Please try again.');
    }
  });
}

  interact(eventId: number, type: InteractionType): void {
    if (!this.currentUserId) return;
    this.eventService.recordInteraction(this.currentUserId, eventId, type).subscribe({
      next: () => console.log(`Interaction recorded: ${type}`),
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
  // Toggle clicked button
  if (clickedBtn.classList.contains('bg-gray-200')) {
    // Activate clicked button
    clickedBtn.classList.remove('bg-gray-200');
    clickedBtn.classList.remove(`text-${clickedBtn.classList.contains('like-btn') ? 'pink' : clickedBtn.classList.contains('dislike-btn') ? 'red' : 'blue'}-500`);
    clickedBtn.classList.add(`bg-${clickedBtn.classList.contains('like-btn') ? 'pink' : clickedBtn.classList.contains('dislike-btn') ? 'red' : 'blue'}-500`);
    clickedBtn.classList.add('text-white');
    
    // Reset other buttons
    [otherBtn1, otherBtn2].forEach(btn => {
      btn.classList.remove(`bg-${btn.classList.contains('like-btn') ? 'pink' : btn.classList.contains('dislike-btn') ? 'red' : 'blue'}-500`);
      btn.classList.remove('text-white');
      btn.classList.add('bg-gray-200');
      btn.classList.add(`text-${btn.classList.contains('like-btn') ? 'pink' : btn.classList.contains('dislike-btn') ? 'red' : 'blue'}-500`);
    });
    
    // Call your original interaction function
    this.interact(eventId, interactionType);
  } else {
    // Deactivate if clicked again
    clickedBtn.classList.add('bg-gray-200');
    clickedBtn.classList.add(`text-${clickedBtn.classList.contains('like-btn') ? 'pink' : clickedBtn.classList.contains('dislike-btn') ? 'red' : 'blue'}-500`);
    clickedBtn.classList.remove(`bg-${clickedBtn.classList.contains('like-btn') ? 'pink' : clickedBtn.classList.contains('dislike-btn') ? 'red' : 'blue'}-500`);
    clickedBtn.classList.remove('text-white');
  }
}

 viewActivities(eventId: number) {
  this.router.navigate(['/activities-in-event'], { 
    state: { eventId: eventId }  // Make sure the property name matches
  });
}
scrollTo(id: string, event: MouseEvent): void {
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
