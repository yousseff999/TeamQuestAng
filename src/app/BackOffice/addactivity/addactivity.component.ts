import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event';
@Component({
  selector: 'app-addactivity',
  templateUrl: './addactivity.component.html',
  styleUrls: ['./addactivity.component.css']
})
export class AddactivityComponent implements OnInit {
  activity: Partial<Activity> = {};
  selectedImage: File | null = null;
  eventId!: number;
  selectedEvent!: Event;
  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const storedEvent = localStorage.getItem('selectedEvent');

  if (storedEvent) {
    this.selectedEvent = JSON.parse(storedEvent);
    this.eventId = this.selectedEvent.eventId;
  } else {
    alert('No event selected.');
    this.router.navigate(['/showevent']); // Optional fallback
  }
}


  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.selectedImage) {
      alert('Please select an image.');
      return;
    }

    this.activityService.addActivityWithImage(
      this.activity as Activity,
      this.selectedImage,
      this.eventId
    ).subscribe({
      next: (response) => {
        console.log('Activity added:', response);
        alert('Activity added successfully!');
        this.router.navigate(['/allactivities']);
      },
      error: (error) => {
        console.error('Error adding activity:', error);
        alert('Failed to add activity.');
      }
    });
  }
 
}
