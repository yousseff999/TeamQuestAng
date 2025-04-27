import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-allteams',
  templateUrl: './allteams.component.html',
  styleUrls: ['./allteams.component.css']
})
export class AllteamsComponent implements OnInit {
  teams: Team[] = [];
  selectedTeam: Team | null = null;
  isLoading: boolean = false;
  message: { text: string; type: 'success' | 'error' } | null = null;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeams();
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

  // Select a team for editing
  editTeam(team: Team): void {
    this.selectedTeam = { ...team }; // Create a copy to avoid direct binding
    this.message = null;
  }

  // Update the selected team
  updateTeam(): void {
    if (this.selectedTeam && this.selectedTeam.name && this.selectedTeam.description) {
      this.isLoading = true;
      this.message = null;

      this.teamService.updateTeam(this.selectedTeam.id, this.selectedTeam).subscribe({
        next: (updatedTeam) => {
          this.selectedTeam = null;
          this.isLoading = false;
          this.message = { text: 'Team updated successfully!', type: 'success' };
          this.loadTeams(); // Refresh the list
        },
        error: (err) => {
          this.isLoading = false;
          this.message = { text: 'Failed to update team.', type: 'error' };
        }
      });
    } else {
      this.message = { text: 'Please fill in all fields.', type: 'error' };
    }
  }

  // Delete a team
  deleteTeam(id: number): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.isLoading = true;
      this.message = null;

      this.teamService.deleteTeam(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = { text: 'Team deleted successfully!', type: 'success' };
          this.loadTeams(); // Refresh the list
          if (this.selectedTeam && this.selectedTeam.id === id) {
            this.selectedTeam = null; // Clear edit form if the deleted team was being edited
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message = { text: 'Failed to delete team.', type: 'error' };
        }
      });
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.selectedTeam = null;
    this.message = null;
  }
}