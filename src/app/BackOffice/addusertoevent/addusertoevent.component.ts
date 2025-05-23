import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { Event } from 'src/app/models/event';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-addusertoevent',
  templateUrl: './addusertoevent.component.html',
  styleUrls: ['./addusertoevent.component.css']
})
export class AddusertoeventComponent implements OnInit {
  event!: Event;
  usersInEvent: User[] = [];
  allUsers: User[] = [];
  selectedUserId: number | null = null;
eventId: number | undefined;
  constructor(
    private eventService: EventService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  goBack(): void {
    this.router.navigate(['/admin']);
  }
  ngOnInit() {
    const navState = window.history.state;
  const eventId = navState.eventId;
  if (eventId) {
    this.eventService.getEventById(eventId).subscribe(event => {
      this.event = event;
      this.usersInEvent = event.users || [];
    });
      this.eventService.showEventUsers(eventId).subscribe(users => {
        this.usersInEvent = users;
      });
      this.userService.getAllUsers().subscribe(users => {
        this.allUsers = users;
      });
    }
  }

  addUser() {
    if (this.selectedUserId != null && this.event?.eventId != null) {
      this.eventService.addUserToEvent(this.event.eventId, this.selectedUserId).subscribe(() => {
        this.eventService.showEventUsers(this.event.eventId).subscribe(users => {
          this.usersInEvent = users;
          this.selectedUserId = null;
        });
      });
    }
  }
  

  removeUserFromEvent(userId: number): void {
    if (this.event?.eventId != null) {
      this.eventService.removeUserFromEvent(this.event.eventId, userId).subscribe(() => {
        this.eventService.showEventUsers(this.event.eventId).subscribe(users => {
          this.usersInEvent = users;
        });
      });
    }
  }
  
  
  isAlreadyInEvent(userId: number): boolean {
    return this.usersInEvent.some(user => user.id === userId);
  }
  
}
