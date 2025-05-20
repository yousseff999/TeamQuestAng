import { Component, OnInit } from '@angular/core';
import { DefiService } from 'src/app/services/defi.service';
import { Router } from '@angular/router';
import { Submission } from 'src/app/models/Submission';

@Component({
  selector: 'app-defisubmissions',
  templateUrl: './defisubmissions.component.html',
  styleUrls: ['./defisubmissions.component.css']
})
export class DefisubmissionsComponent implements OnInit {
  submissions: Submission[] = [];
  defiId: number;
  loading: boolean = true;
  error: string | null = null;
  successMessage: string | null = null;
isSubmittingScore: boolean = false;
  constructor(
    private defiService: DefiService,
    private router: Router
  ) {
    this.defiId = history.state.defiId; // Get defiId from navigation state
  }

  ngOnInit(): void {
    if (!this.defiId) {
      this.error = 'No DeFi ID provided';
      this.loading = false;
      return;
    }
    this.getSubmissions();
  }

  getSubmissions(): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;
    this.defiService.getSubmissionsByDefiId(this.defiId).subscribe({
      next: (data) => {
        console.log('API Response:', data); 
        this.submissions = data;
        this.loading = false;
      },
      error: () => {
        this.error = '❌ Failed to load submissions';
        this.loading = false;
      }
    });
  }

  addScore(submission: Submission): void {
    if (!submission.team) {
      this.error = 'Cannot add score - team information is missing';
      return;
    }
    
    if (!submission.scoreInput || submission.scoreInput <= 0) {
      this.error = 'Please enter a positive score';
      return;
    }

    this.error = null;
    this.successMessage = null;
    this.isSubmittingScore = true;

    this.defiService.addScoreToTeam(submission.team.id, submission.scoreInput).subscribe({
      next: (updatedTeam) => {
        this.successMessage = `✅ Score of ${submission.scoreInput} added to ${submission.team!.name}`;
        submission.scoreInput = undefined;
        
        // Update the team score in all submissions from this team
        this.submissions.forEach(s => {
          if (s.team && s.team.id === updatedTeam.id) {
            s.team.score_t = updatedTeam.score_t;
          }
        });
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Failed to update score';
        console.error('Error adding score:', err);
      },
      complete: () => {
        this.isSubmittingScore = false;
      }
    });
  }

 

}