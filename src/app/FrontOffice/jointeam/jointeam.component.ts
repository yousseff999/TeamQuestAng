import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { AuthService } from 'src/app/services/auth.service';
import { Team } from 'src/app/models/team';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jointeam',
  templateUrl: './jointeam.component.html',
  styleUrls: ['./jointeam.component.css']
})
export class JointeamComponent implements OnInit {
  teams: Team[] = [];
  isLoading: boolean = false;
  message: { text: string; type: 'success' | 'error' } | null = null;
  currentUserId: number | null = null;
  loadingTeamId: number | null = null; // Track which team is being joined

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    const userId = this.authService.getUserId();
    if (userId) {
      this.currentUserId = parseInt(userId, 10); // Convert string to number
      if (isNaN(this.currentUserId)) {
        this.currentUserId = null;
        this.message = { text: 'Invalid user ID. Please log in again.', type: 'error' };
      }
    } else {
      this.message = { text: 'You must be logged in to join a team.', type: 'error' };
    }
  }

  // Load all teams
  loadTeams(): void {
    this.isLoading = true;
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.isLoading = false;
      },
      error: (err) => {
        this.message = { text: 'Failed to load teams.', type: 'error' };
        this.isLoading = false;
      }
    });
  }

  // Join the selected team
  joinTeam(id: number): void {
    if (!this.currentUserId) {
      this.message = { text: 'You must be logged in to join a team.', type: 'error' };
      return;
    }

    this.loadingTeamId = id; // Track the team being joined
    this.message = null;

    this.teamService.addUserToTeam(id, this.currentUserId).subscribe({
      next: (updatedTeam) => {
        this.loadingTeamId = null;
        this.message = { text: 'Successfully joined the team!', type: 'success' };
        // Optionally refresh the teams list to reflect the updated members
        this.loadTeams();
      },
      error: (err) => {
        this.loadingTeamId = null;
        this.message = { text: 'Failed to join the team.', type: 'error' };
      }
    });
  }
  scrollTo(id: string, event: Event) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  navigateToCategory(category: string) {
  this.router.navigate(['/eventscategory', category]);
}
}