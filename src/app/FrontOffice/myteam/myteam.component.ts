import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { AuthService } from 'src/app/services/auth.service';
import { Team } from 'src/app/models/team';
import { Defi } from 'src/app/models/defi';
import { DefiService } from 'src/app/services/defi.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-myteam',
  templateUrl: './myteam.component.html',
  styleUrls: ['./myteam.component.css']
})
export class MyteamComponent implements OnInit {
  myTeam: Team | null = null;
  lastDefi: Defi | null = null;
  loading = true;
  error: string | null = null;
showDefi: boolean = false;
showAnswerForm: boolean = false;
  answerContent: string = '';
  submitMessage: string = '';
   darkMode = false;
  constructor(private teamService: TeamService, private authService: AuthService,
     private defiService : DefiService, private router: Router) {}

  ngOnInit(): void {

  const currentUserIdStr = this.authService.getUserId(); 

  if (!currentUserIdStr) {
    this.error = 'User not logged in';
    this.loading = false;
    return;
  }

  const currentUserId = Number(currentUserIdStr);

  this.teamService.getTeamByUserId(currentUserId).subscribe({
    next: (team) => {
      this.myTeam = team;
      this.loading = false;
       this.loadLastDefi();
    },
    error: (err) => {
      this.error = 'Failed to load your team';
      this.loading = false;
      console.error(err);
    }
  });
}
 loadLastDefi(): void {
  this.defiService.getLastCreatedDefi().subscribe({
    next: (defi) => {
      this.lastDefi = defi;
      console.log('Loaded defi:', defi);

      if (this.myTeam?.id != null && this.lastDefi?.id != null) {
        this.defiService.hasTeamSubmittedToDefi(this.myTeam.id, this.lastDefi.id).subscribe({
          next: (hasSubmitted) => {
            console.log(`Submission check for team ${this.myTeam?.id} and defi ${this.lastDefi?.id}:`, hasSubmitted);
            if (hasSubmitted) {
              this.showDefi = true;  // hide defi since team already submitted
            } else {
              this.showDefi = true;   // show defi if not submitted
            }
          },
          error: (err) => {
            console.error('Error checking submission status', err);
            this.showDefi = true;  // fallback: show defi
          }
        });
      } else {
        this.showDefi = true;  // show defi if team or defi id missing
      }
    },
    error: (err) => {
      console.error('Erreur lors du chargement du dernier défi', err);
      this.showDefi = false;
    }
  });
}


  toggleDefi() {
  this.showDefi = !this.showDefi;
  }
 
takePart(): void {
    this.showDefi = false;
    this.showAnswerForm = true;
  }

  submitAnswer(): void {
    if (this.myTeam && this.answerContent.trim()) {
      this.defiService.submitToLatestDefi(this.myTeam.id, this.answerContent).subscribe({
        next: () => {
          this.submitMessage = "✅ Your challenge response was successfully submitted!";
          this.showAnswerForm = false;
          this.showDefi = false; 
        },
        error: () => {
          this.submitMessage = "Failed to submit. Try again.";
        }
      });
    }
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
