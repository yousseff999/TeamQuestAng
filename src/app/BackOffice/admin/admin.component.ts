import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TypeEvent } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { EventService } from 'src/app/services/event.service';
import { Event as MyEvent} from 'src/app/models/event'; 
import { UserService } from 'src/app/services/user.service';
import { TeamService } from 'src/app/services/team.service';
import { DepartmentService } from 'src/app/services/department.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  dropdownopen = false;
  dropdownOpen = false;
  subDropdownOpen = false;
  eventTypes = Object.values(TypeEvent);
  eventParticipants: {event: MyEvent, users: User[]}[] = []; 
  loading = true;
  error = '';
  topScorer?: User;
  totalUsers: number = 0;
  users: User[] = [];
  monthlyGrowth: number = 0;
  totalTeams: number = 0;
  weeklyPercentageChange: number = 0;
  totalDepartments: number = 0;
  totalEventParticipants: number = 0;
  totalAllEventParticipations: number = 0;
  topScoringTeam: any;
   categories = ['SPORTS', 'CULTURAL', 'PARTY', 'CAMPING']; 
  selectedCategory = '';
  stats: { [key: string]: number } = {};
  chartLabels = ['Likes', 'Dislikes', 'Interested'];
  chartData: number[] = [];
  chartType: 'bar' | 'pie' = 'bar';
  mostEngagedUser?: User;
leastEngagedUser?: User;
engagementRanking: User[] = [];

toggledropdown(): void {
     this.dropdownopen = !this.dropdownopen;
  }
  toggleDropdown(): void {
     this.dropdownOpen = !this.dropdownOpen;
  if (!this.dropdownOpen) {
    this.subDropdownOpen = false; // close subdropdown if main closes
  }
  }
  toggleSubDropdown(event: Event) {
  event.stopPropagation(); // prevent main toggle from closing
  this.subDropdownOpen = !this.subDropdownOpen;
}
toggleChartType() {
  this.chartType = this.chartType === 'bar' ? 'pie' : 'bar';
}
  closeDropdown() {
    this.dropdownOpen = false;
     this.subDropdownOpen = false;
  }
  constructor(private authService: AuthService, private router: Router ,
     private eventService: EventService, private userService : UserService ,
     private teamService : TeamService, private departmentService : DepartmentService,
     private interactionService : InteractionService) {}
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
    this.loadUserCount();
    this.loadMonthlyUserGrowth();
    this.loadTeamCount();
    this.loadWeeklyTeamChange(); 
    this.loadDepartmentCount();
    this.loadEventParticipantsCount();
    this.loadTopScoringTeam();
    this.loadTotalAllEventParticipations();
    this.loadMostEngagedUser();
    this.loadLeastEngagedUser();
    this.loadEngagementRanking();

  }
  loadMostEngagedUser(): void {
  this.userService.getMostEngagedUser().subscribe({
    next: (user) => this.mostEngagedUser = user,
    error: (err) => console.error('Failed to load most engaged user:', err)
  });
}

loadLeastEngagedUser(): void {
  this.userService.getLeastEngagedUser().subscribe({
    next: (user) => this.leastEngagedUser = user,
    error: (err) => console.error('Failed to load least engaged user:', err)
  });
}

loadEngagementRanking(): void {
  this.userService.getUsersByEngagement().subscribe({
    next: (users) => this.engagementRanking = users,
    error: (err) => console.error('Failed to load engagement ranking:', err)
  });
}

  loadTotalAllEventParticipations(): void {
  this.eventService.getTotalUserParticipations().subscribe({
    next: (count) => {
      this.totalAllEventParticipations = count;
    },
    error: (err) => {
      console.error('Failed to load total user participations:', err);
    }
  });
}

loadGlobalStats() {
    this.interactionService.getGlobalStats().subscribe(data => {
      this.stats = data;
      this.chartData = [data['LIKE'] || 0, data['DISLIKE'] || 0, data['INTERRESTED'] || 0];

    });
  }

  onCategoryChange() {
    if (this.selectedCategory) {
      this.interactionService.getStatsByCategory(this.selectedCategory).subscribe(data => {
        this.stats = data;
        this.chartData = [data['LIKE'] || 0, data['DISLIKE'] || 0, data['INTERRESTED'] || 0];

      });
    }
  }
  loadTopScoringTeam() {
  this.teamService.getTopScoringTeam().subscribe({
    next: (data) => {
      this.topScoringTeam = data;
    },
    error: (err) => console.error('Error loading top scoring team', err)
  });
}
  
loadEventParticipantsCount() {
  this.eventService.getUniqueParticipantsCount().subscribe(
    (count) => this.totalEventParticipants = count
  );
}
  loadWeeklyTeamChange(): void {
  this.teamService.getWeeklyPercentageChange().subscribe({
    next: (percent) => {
      this.weeklyPercentageChange = percent;
    },
    error: (err) => {
      console.error('Failed to load weekly team percentage change', err);
    }
  });
}

loadDepartmentCount() {
  this.departmentService.getDepartmentCount().subscribe(
    (count) => this.totalDepartments = count
  );
}
  loadMonthlyUserGrowth(): void {
  this.userService.getAllUsers().subscribe({
    next: (users: User[]) => {
      this.users = users;
      this.monthlyGrowth = this.calculateMonthlyUserGrowth(users);
    },
    error: (err) => {
      console.error('Failed to load users for growth calculation:', err);
    }
  });
}
loadTeamCount(): void {
  this.teamService.getTeamCount().subscribe({
    next: (count) => {
      this.totalTeams = count;
    },
    error: (err) => {
      console.error('Failed to load team count:', err);
    }
  });
}
loadUserCount(): void {
    this.userService.countUsers().subscribe({
      next: (count: number) => {
        this.totalUsers = count;
        console.log('Total users:', count);
      },
      error: (err) => {
        console.error('Failed to load user count:', err);
      }
    });
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
  this.router.navigate(['/addusertoevent'], {
    state: { eventId: eventId }
  });
}
calculateMonthlyUserGrowth(users: User[]): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let currentMonthCount = 0;
  let lastMonthCount = 0;

  users.forEach(user => {
    const createdDate = new Date(user.createdAt);
    const userMonth = createdDate.getMonth();
    const userYear = createdDate.getFullYear();

    if (userYear === currentYear && userMonth === currentMonth) {
      currentMonthCount++;
    } else if (
      (userYear === currentYear && userMonth === currentMonth - 1) ||
      (currentMonth === 0 && userYear === currentYear - 1 && userMonth === 11)
    ) {
      lastMonthCount++;
    }
  });

  if (lastMonthCount === 0) return 100; // Avoid division by zero

  const growth = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
  return Math.round(growth);
}

}
