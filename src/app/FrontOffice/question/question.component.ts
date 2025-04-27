import { Component, OnInit } from '@angular/core';
import { ChallengeService } from 'src/app/services/challenge.service';
import { Question } from 'src/app/models/question';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  questions: Question[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  difficultyForm: FormGroup;
  userAnswers: string[] = [];
   score: number = 0; 
  difficultyLevels = [
    { value: 1, label: 'Easy' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Hard' }
  ];

  constructor(
    private challengeService: ChallengeService,
    private fb: FormBuilder
  ) {
    this.difficultyForm = this.fb.group({
      difficulty: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  onGenerateQuestions(): void {
    if (this.difficultyForm.invalid) {
      this.errorMessage = 'Please select a difficulty level.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const difficulty = this.difficultyForm.value.difficulty;

    this.challengeService.generateQuestions(difficulty).subscribe({
      next: (questions: Question[]) => {
        this.questions = questions;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to generate questions.';
        this.isLoading = false;
      }
    });
  }
  selectAnswer(questionIndex: number, answer: string): void {
    this.userAnswers[questionIndex] = answer;
  }

  submitAnswers(): void {
    this.challengeService.evaluateChallenge(this.questions, this.userAnswers).subscribe({
      next: (response) => {
        this.score = response.score;
        alert(`You scored: ${this.score} points! (out of ${this.questions.length} questions)`);
        // Assuming you have the current user ID 
        const userId = Number(localStorage.getItem('userId'));
        if (!userId) {
          console.error('User ID not found.');
          return;
        }

      // Update the user score in the database
      this.challengeService.updateScore(this.score, userId).subscribe({
        next: () => {
          console.log('User score updated successfully!');
        },
        error: (err) => {
          console.error('Failed to update score:', err);
        }
      });
      },
      error: (err) => {
        alert('Evaluation failed.');
      }
    });
  }
}
