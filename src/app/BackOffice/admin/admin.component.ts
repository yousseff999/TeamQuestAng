import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TypeEvent } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { EventService } from 'src/app/services/event.service';
import { Event as MyEvent} from 'src/app/models/event'; 
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  
  dropdownOpen = false;
  eventTypes = Object.values(TypeEvent);
  eventParticipants: {event: MyEvent, users: User[]}[] = []; 
  loading = true;
  error = '';
  topScorer?: User;
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
  constructor(private authService: AuthService, private router: Router ,
     private eventService: EventService, private userService : UserService) {}
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
  // Logout function to clear session and navigate to login page
  logout(): void {
    this.authService.logout(); // Call logout from AuthService
     // Navigate to login page after logout
  }
  

  ngOnInit(): void {
    this.loadEventParticipants();
     this.loadTopScorer(); 
  }

  loadEventParticipants(): void {
    this.loading = true;
    this.error = '';
    
    this.eventService.getAllEvents().subscribe({
      next: (events: MyEvent[]) => {
        events.forEach(event => {
          this.eventService.showEventUsers(event.eventId).subscribe({
            next: (users) => {
              this.eventParticipants.push({
                event: event,
                users: users
              });
            },
            error: (err) => {
              console.error(`Failed to load participants for event ${event.eventId}:`, err);
              this.eventParticipants.push({
                event: event,
                users: []
              });
            },
            complete: () => {
              this.loading = false;
            }
          });
        });
      },
      error: (err) => {
        console.error('Failed to load events:', err);
        this.error = 'Failed to load events data';
        this.loading = false;
      }
    });
  }
   loadTopScorer(): void {
    this.userService.getTopScorer().subscribe({
      next: (user: User) => {
        this.topScorer = user;
        console.log('Top scorer:', user);
      },
      error: (err) => {
        console.error('Failed to load top scorer:', err);
      }
    });
  }
  navigateToAddUser(eventId: number): void {
    this.router.navigate(['/addusertoevent', eventId]);
}

}
