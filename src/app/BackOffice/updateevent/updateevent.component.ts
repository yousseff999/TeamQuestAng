import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event, TypeEvent } from 'src/app/models/event';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-updateevent',
  templateUrl: './updateevent.component.html',
  styleUrls: ['./updateevent.component.css']
})
export class UpdateeventComponent implements OnInit {
  eventForm: FormGroup;
  eventId!: number;
  typeEvents = Object.values(TypeEvent); // For the select dropdown
  errorMessage: string | null = null; // Add error message property
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
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

  ngOnInit(): void {
    // Get eventId from route parameters
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEvent();
  }

  loadEvent(): void {
    this.isLoading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event: Event) => {
        this.eventForm.patchValue({
          eventName: event.eventName,
          description: event.description,
          startDate: new Date(event.startDate).toISOString().slice(0, 16),
          endDate: new Date(event.endDate).toISOString().slice(0, 16),
          location: event.location,
          eventImage: event.eventImage,
          eventType: event.eventType
        });
        this.errorMessage = null; // Clear error on success
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading event:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        //this.errorMessage = 'Unable to load event. Please try again later.';
        // Optionally, redirect after a delay to show the error
        //setTimeout(() => this.router.navigate(['/showevent']), 3000);
        if (err.status === 401 || err.error?.message?.includes('JWT')) {
          this.errorMessage = 'Authentication error. Please log in again.';
        } else if (err.status === 404) {
          this.errorMessage = 'Event not found. You can still edit the form.';
        } else {
          this.errorMessage = 'Unable to load event data. You can still edit the form.';
        }
        this.isLoading = false;
      
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isLoading = true;
      const updatedEvent: Event = {
        ...this.eventForm.value,
        eventId: this.eventId,
        startDate: new Date(this.eventForm.value.startDate),
        endDate: new Date(this.eventForm.value.endDate),
        feedbacks: [],
        participants: [],
        activities: []
      };

      this.eventService.updateEvent(this.eventId, updatedEvent).subscribe({
        next: () => {
          console.log('Event updated successfully');
          this.errorMessage = null;
          this.isLoading = false;
          this.router.navigate(['/showevent']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating event:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          if (err.status === 401 || err.error?.message?.includes('JWT')) {
            this.errorMessage = 'Authentication error. Please log in again.';
          } else if (err.status === 404) {
            this.errorMessage = 'Event not found. Please check the event ID.';
          } else {
            this.errorMessage = 'Failed to update event. Please try again.';
          }
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/showevent']); // Redirect to events list
  }
}