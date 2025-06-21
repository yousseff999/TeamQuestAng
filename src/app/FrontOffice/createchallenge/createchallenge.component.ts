import { Component, OnInit } from '@angular/core';
import { ChallengeService } from 'src/app/services/challenge.service';
import { Challenge } from 'src/app/models/challenge';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/services/notification.service';
import { ChatMessage } from 'src/app/models/chat-message';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
@Component({
  selector: 'app-createchallenge',
  templateUrl: './createchallenge.component.html',
  styleUrls: ['./createchallenge.component.css'],
})
export class CreatechallengeComponent implements OnInit {
  challengeForm: FormGroup;
  availableParticipants: User[] = [];
  errorMessage: string | null = null;
  currentUserId: number | null = null;
  isLoading: boolean = false;
  difficultyLevels = [
    { value: 1, label: 'Easy' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Hard' }
  ];
  opponentControl = new FormControl('');
  isOpponentFocused: boolean = false;
filteredParticipants$: Observable<User[]> = new Observable();
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router 
  ) {
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      opponentId: [null, Validators.required],
      difficultyLevel: [null, Validators.required] 
    });
  }

  ngOnInit(): void {
  // 1. Handle challengeId from email link
  this.route.queryParams.subscribe(params => {
    const challengeId = params['challengeId'];
    const accept = params['accept'];

    if (challengeId && accept === 'true') {
      console.log('Received challengeId from email:', challengeId);

      // Appel au backend pour récupérer la difficulté
      this.challengeService.getChallengeById(challengeId).subscribe({
        next: (challenge: Challenge) => {
          const difficulty = challenge.difficultyLevel;
          console.log('➡️ redirecting to questions with difficulty:', difficulty);
          // Rediriger vers questions avec les queryParams
          this.router.navigate(['/questions'], { queryParams: { challengeId, difficulty } });
        },
        error: (err) => {
          console.error('Error fetching challenge difficulty:', err);
          // En cas d’erreur, rediriger sans difficulty
          this.router.navigate(['/questions'], { queryParams: { challengeId } });
        }
      });
    }
  });

  // 2. Load current user info and notifications
  const userId = this.authService.getUserId();
  if (userId) {
    this.currentUserId = parseInt(userId, 10);
    if (isNaN(this.currentUserId)) {
      this.currentUserId = null;
      this.errorMessage = 'Invalid user ID. Please log in again.';
    } else {
      this.loadUsers();

      // Connect to WebSocket for notifications
      const username = this.authService.getUsername();
      if (username) {
        this.notificationService.connect(username, (message: ChatMessage) => {
          console.log('Notification reçue:', message);
          alert(`Notification: ${message.content}`);
        });
      }
    }
  } else {
    this.errorMessage = 'You must be logged in to create a challenge.';
  }
}

  ngOnDestroy(): void {
    this.notificationService.disconnect(); 
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.availableParticipants = users.filter(user => user.id !== this.currentUserId);
        console.log('Available participants:', this.availableParticipants);
        this.isLoading = false;
        this.filteredParticipants$ = this.opponentControl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterParticipants(value || ''))
        );
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }
  onOpponentBlur(): void {
  // attend un peu pour permettre le clic sur un élément de la liste
  setTimeout(() => {
    this.isOpponentFocused = false;
  }, 200);
}
 private filterParticipants(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.availableParticipants.filter(user =>
      user.username.toLowerCase().includes(filterValue) || user.email.toLowerCase().includes(filterValue)
    );
  }
  onSubmit(): void {
    console.log('Selected opponentId:', this.challengeForm.value.opponentId); // Debug
  if (this.challengeForm.invalid || !this.currentUserId) {
    this.errorMessage = 'Please fill all required fields.';
    return;
  }
    if (this.challengeForm.invalid || !this.currentUserId) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const challengeData: Challenge = {
      title: this.challengeForm.value.title,
      description: this.challengeForm.value.description,
      creatorId: this.currentUserId!,
      opponentId: this.challengeForm.value.opponentId,
      id: 0,
      difficultyLevel: this.challengeForm.value.difficultyLevel,
      score_c: 0
    };

    this.challengeService.createChallenge(challengeData).subscribe({
      next: () => {
        this.isLoading = false;
        this.challengeForm.reset();
        alert('Challenge created successfully!');
        //////zyeda
        const opponent = this.availableParticipants.find(user => user.id === challengeData.opponentId);
      const currentUsername = this.authService.getUsername();

      if (opponent && currentUsername) {
        // Send challenge notification to opponent
        this.notificationService.sendChallengeNotification(
          opponent.username,
          {
            title: challengeData.title,
            description: challengeData.description
          },
          currentUsername
        );
        console.log('Challenge notification sent to:', opponent.username);
      } else {
        console.error('Opponent not found or current user not authenticated');
      }
      
      localStorage.setItem('selectedDifficulty', String(challengeData.difficultyLevel));

        this.router.navigate(['/questions'], {
  state: { difficulty: challengeData.difficultyLevel }
});
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create challenge.';
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
