import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-activitiesinevents',
  templateUrl: './activitiesinevents.component.html',
  styleUrls: ['./activitiesinevents.component.css']
})
export class ActivitiesineventsComponent  implements OnInit {
  eventId!: number;
  activities: Activity[] = [];
  images: { [key: number]: string } = {};
  
  constructor(private router: Router, private activityService: ActivityService,private authService: AuthService) {}

  ngOnInit(): void {
    
  // First try to get from navigation extras
  const navigation = this.router.getCurrentNavigation();
  this.eventId = navigation?.extras?.state?.['eventId'];

  // If not found (like on page refresh), try history state
  if (!this.eventId) {
    this.eventId = history.state?.eventId;
  }

  if (!this.eventId) {
    console.error('No eventId set!');
    // You might want to redirect back or handle this case
    return;
  }

  this.loadActivities();
}


  loadActivities() {
    this.activityService.getActivitiesByEventId(this.eventId).subscribe({
      next: (data) => {
        this.activities = data;
        this.loadImages();
      },
      error: (err) => {
        console.error('Error loading activities:', err);
      }
    });
  }

  loadImages() {
    this.activities.forEach(activity => {
      this.activityService.getImageUrlForActivityByID(activity.activityID!).subscribe({
        next: (imgUrl) => this.images[activity.activityID!] = imgUrl,
        error: () => this.images[activity.activityID!] = 'assets/default-image.jpg'
      });
    });
  }
  registerToActivity(activity: Activity) {
  const userIdString = this.authService.getUserId();

  if (!userIdString) {
    alert("Utilisateur non connecté !");
    return;
  }

  if (activity.status !== 'Open') {
    alert("Cette activité est fermée et ne permet plus l'inscription.");
    return;
  }

  const userId = Number(userIdString);

  this.activityService.registerUserToActivity(userId, activity.activityID, this.eventId).subscribe({
    next: () => {
      alert('Inscription réussie à l’activité !');
      this.loadActivities();
    },
    error: (err) => {
      alert('Erreur : ' + err.error);
    }
  });
}


}
