import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-updateactivity',
  templateUrl: './updateactivity.component.html',
  styleUrls: ['./updateactivity.component.css']
})
export class UpdateactivityComponent implements OnInit {
  activityID!: number;
  activity: Activity = {} as Activity;
  selectedImage: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idFromStorage = localStorage.getItem('editActivityId');
    if (idFromStorage) {
      this.activityID = +idFromStorage;
      this.activityService.getActivityById(this.activityID).subscribe((data) => {
        this.activity = data;
      });
    } else {
      alert('No activity selected to edit.');
      this.router.navigate(['/allactivities']);
    }
  }
  

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  onSubmit(): void {
    // First, update the activity fields (without image)
    this.activityService.updateActivity(this.activityID, this.activity).subscribe(() => {
      // Then, update the image if a new one is selected
      if (this.selectedImage) {
        this.activityService.updateActivityImage(this.activityID, this.selectedImage).subscribe(() => {
          alert('Activity updated successfully');
          this.router.navigate(['/allactivities']); // Change this to your desired route
        });
      } else {
        alert('Activity updated (without image)');
        this.router.navigate(['/allactivities']);
      }
    });
  }
}