import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event as EventModel, TypeEvent } from 'src/app/models/event';
import { HttpErrorResponse } from '@angular/common/http';
import { PredictionService } from 'src/app/services/prediction.service'; // Import PredictionService
import { Observable } from 'rxjs';

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
  selectedImageFile: File | null = null;
  predictionResult: string | null = null; 

  // Mapping eventType to category_encoded (adjust based on your LabelEncoder)
  private eventTypeToCategoryEncoded: { [key: string]: number } = {
    [TypeEvent.CAMPING]: 0,
    [TypeEvent.CULTURAL]: 1,
    [TypeEvent.PARTY]: 2,
    [TypeEvent.SPORTS]: 3
  };

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private predictionService: PredictionService 
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

  onFileSelected(event: any): void {   
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // Prepare prediction data
      const startDate = new Date(this.eventForm.value.startDate);
      const predictionData = {
        Attendance: 250, 
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1, 
        day: startDate.getDate(),
        category_encoded: this.eventTypeToCategoryEncoded[this.eventForm.value.eventType]
      };

      // Call prediction service
      this.predictionService.predict(predictionData).subscribe({
        next: (prediction) => {
          this.predictionResult = prediction;
          this.isLoading = false;

          // Prompt user to confirm based on prediction
          const confirmMessage = `Prediction: This event is likely to be "${prediction}". Do you want to proceed with creating the event?`;
          if (confirm(confirmMessage)) {
            this.createEvent();
          } else {
            this.isLoading = false;
            this.errorMessage = 'Event creation cancelled based on prediction.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to get prediction: ' + err.message;
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.isLoading = false;
    }
  }

  // Separate method to handle event creation
  private createEvent(): void {
    const newEvent: EventModel = {
      ...this.eventForm.value,
      startDate: new Date(this.eventForm.value.startDate),
      endDate: new Date(this.eventForm.value.endDate),
      feedbacks: [],
      participants: [],
      activities: []
    };

    this.eventService.addEvent(newEvent).subscribe({
      next: (createdEvent) => {
        if (this.selectedImageFile && createdEvent.eventId) {
          this.eventService.updateEventImage(createdEvent.eventId, this.selectedImageFile).subscribe({
            next: () => {
              this.errorMessage = null;
              this.isLoading = false;
              this.router.navigate(['/showevent']);
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error uploading image:', err);
              this.errorMessage = 'Event created, but failed to upload image.';
              this.isLoading = false;
            }
          });
        } else {
          this.errorMessage = null;
          this.isLoading = false;
          this.router.navigate(['/showevent']);
        }
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
  }

  cancel(): void {
    this.router.navigate(['/showevent']);
  }
}