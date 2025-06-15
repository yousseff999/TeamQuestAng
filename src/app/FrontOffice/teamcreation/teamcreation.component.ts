import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-teamcreation',
  templateUrl: './teamcreation.component.html',
  styleUrls: ['./teamcreation.component.css']
})
export class TeamcreationComponent implements OnInit {
  team: Partial<Team> = { name: '', description: '' };
  createdTeam!: Team;
  users: User[] = [];
  selectedUserId: number | null = null;
  isLoading: boolean = false;
  message: { text: string; type: 'success' | 'error' } | null = null;

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Loaded users:', this.users);
      },
      error: () => {
        this.message = { text: 'Failed to load users.', type: 'error' };
      }
    });
  }

  createTeam(): void {
    if (this.team.name && this.team.description) {
      this.isLoading = true;
      this.message = null;

      this.teamService.createTeam(this.team as Team).subscribe({
        next: (created) => {
          this.createdTeam = created;
          this.team = { name: '', description: '' };
          this.isLoading = false;
          this.message = { text: 'Team created successfully!', type: 'success' };
        },
        error: () => {
          this.isLoading = false;
          this.message = { text: 'Failed to create team.', type: 'error' };
        }
      });
    } else {
      this.message = { text: 'Please fill in all fields.', type: 'error' };
    }
  }

  addUserToTeam(): void {
    if (!this.selectedUserId || !this.createdTeam?.id) return;

    this.isLoading = true;
    this.message = null;

    this.teamService.addUserToTeam(this.createdTeam.id, this.selectedUserId).subscribe({
      next: () => {
        this.isLoading = false;
        this.message = { text: 'User added to team successfully!', type: 'success' };

        // Optional: Refresh team members list if you fetch from server
      },
      error: (err) => {
        console.error('Error adding user:', err);
        this.isLoading = false;
        this.message = { text: 'Failed to add user to team.', type: 'error' };
      }
    });
  }

  goBack(): void {
    this.location.back();
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
