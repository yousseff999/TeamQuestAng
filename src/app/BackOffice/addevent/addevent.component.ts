import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event, TypeEvent } from 'src/app/models/event';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.css']
})
export class AddeventComponent implements OnInit {
  eventForm: FormGroup;
  typeEvents = Object.values(TypeEvent);
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      location: ['', [Validators.required]],
      eventImage: [''],
      eventType: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isLoading = true;
      const newEvent: Event = {
        ...this.eventForm.value,
        startDate: new Date(this.eventForm.value.startDate),
        endDate: new Date(this.eventForm.value.endDate),
        feedbacks: [],
        participants: [],
        activities: []
      };

      this.eventService.addEvent(newEvent).subscribe({
        next: () => {
          this.errorMessage = null;
          this.isLoading = false;
          this.router.navigate(['/showevent']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error adding event:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          if (err.status === 401 || err.error?.message?.includes('JWT')) {
            this.errorMessage = 'Authentication error. Please log in again.';
          } else if (err.status === 403) {
            this.errorMessage = 'You do not have permission to add events. Admin access required.';
          } else {
            this.errorMessage = 'Failed to add event: ' + (err.error?.message || 'Server error');
          }
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.isLoading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/showevent']);
  }
}