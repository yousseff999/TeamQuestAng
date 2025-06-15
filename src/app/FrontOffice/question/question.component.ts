import { Component, OnInit } from '@angular/core';
import { ChallengeService } from 'src/app/services/challenge.service';
import { Question } from 'src/app/models/question';
import { HttpErrorResponse } from '@angular/common/http';
import { RankService } from 'src/app/services/rank.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  questions: Question[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  userAnswers: string[] = [];
  score = 0;
  selectedDifficulty: number | null = null;
  selectedDifficultyLabel: string | null = null;

  difficultyLevels = [
    { value: 1, label: 'Easy' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Hard' }
  ];

  constructor(private challengeService: ChallengeService, private rankService : RankService, private router : Router) {}

  ngOnInit(): void {
    // Option 1: Get difficulty from localStorage (saved after challenge creation)
    const difficultyStr = localStorage.getItem('selectedDifficulty');
    if (difficultyStr) {
      this.selectedDifficulty = parseInt(difficultyStr, 10);
      this.selectedDifficultyLabel = this.difficultyLevels.find(
        (d) => d.value === this.selectedDifficulty
      )?.label || null;
    } else {
      this.errorMessage = 'Difficulty level not found. Please create a challenge first.';
    }
  }

  onGenerateQuestions(): void {
    if (this.selectedDifficulty === null) {
      this.errorMessage = 'Difficulty level is missing.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.challengeService.generateQuestions(this.selectedDifficulty).subscribe({
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

        const userId = Number(localStorage.getItem('userId'));
        if (!userId) {
          console.error('User ID not found.');
          return;
        }

        this.challengeService.updateScore(this.score, userId).subscribe({
          next: () => {
            console.log('User score updated successfully!');
          },
          error: (err) => {
            console.error('Failed to update score:', err);
          }
        });
      },
      error: () => {
        alert('Evaluation failed.');
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
