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
  constructor(
    private fb: FormBuilder,
    private challengeService: ChallengeService,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      opponentId: [null, Validators.required],
      difficultyLevel: [null, Validators.required] 
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.currentUserId = parseInt(userId, 10);
      if (isNaN(this.currentUserId)) {
        this.currentUserId = null;
        this.errorMessage = 'Invalid user ID. Please log in again.';
      } else {
        this.loadUsers();
      }
    } else {
      this.errorMessage = 'You must be logged in to create a challenge.';
    }
    // Connect to WebSocket and handle incoming private messages
  const username = this.authService.getUsername(); // Make sure you have this function
  if (username) {
    this.notificationService.connect(username, (notification: any) => {
      const message = JSON.parse(notification.body);
      alert('New challenge: ' + message.content); // Simple popup
    });
  }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.availableParticipants = users.filter(user => user.id !== this.currentUserId);
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
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

        if (opponent) {
          const message: ChatMessage = {
            id: Date.now(), // temporary unique id (timestamp) for frontend, server can generate real one
            sender: this.authService.getUserId()!, // logged-in user ID or username
            content: 'You have been challenged! 💪'
          };
      
          // Send the message to the opponent
          this.notificationService.sendPrivateMessage(opponent.username, message);
        } else {
          console.error('Opponent not found');
        }
        /////
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create challenge.';
      }
    });
  }
}
