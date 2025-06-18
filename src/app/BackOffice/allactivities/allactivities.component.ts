import { Component, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allactivities',
  templateUrl: './allactivities.component.html',
  styleUrls: ['./allactivities.component.css']
})
export class AllactivitiesComponent implements OnInit {
  activities: Activity[] = [];
  searchQuery: string = '';
 isCardView: boolean = true;
  constructor(private activityService: ActivityService, private router:Router) {}
 toggleView(): void {
    this.isCardView = !this.isCardView;
  }
  ngOnInit(): void {
    this.loadAllActivities();
  }

  loadAllActivities(): void {
    this.activityService.getAllActivities().subscribe((data: Activity[]) => {
      this.activities = data;
      this.loadImages();
    });
  }

  loadImages(): void {
    this.activities.forEach(activity => {
      if (activity.activityID) {
        this.activityService.getImageUrlForActivityByID(activity.activityID).subscribe({
          next: (url: string) => activity.activityImage = url,
          error: () => activity.activityImage = 'assets/default-image.jpg'
        });
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.loadAllActivities();
    } else {
      this.activityService.searchActivityByName(this.searchQuery).subscribe((results: Activity[]) => {
        this.activities = results;
        this.loadImages();
      });
    }
  }
  deleteActivity(activityId: number): void {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.deleteActivity(activityId, { responseType: 'text' as 'json' }).subscribe({
        next: () => {
          location.reload(); // ✅ Force reload
        },
        error: err => {
          console.error('Delete failed', err);
          alert('Failed to delete activity');
        }
      });
    }
  }
  goToEditActivity(activityID: number): void {
    localStorage.setItem('editActivityId', activityID.toString());
    this.router.navigate(['/updateactivity']);
  }
  
}
