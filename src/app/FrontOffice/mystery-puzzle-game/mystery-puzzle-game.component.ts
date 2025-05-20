import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-mystery-puzzle-game',
  templateUrl: './mystery-puzzle-game.component.html',
  styleUrls: ['./mystery-puzzle-game.component.css']
})
export class MysteryPuzzleGameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userInput', { static: false }) userInput!: ElementRef<HTMLInputElement>;
  private ctx!: CanvasRenderingContext2D;

  // Game dimensions
  WIDTH: number = 800;
  HEIGHT: number = 600;
  SCREEN_WIDTH: number = window.innerWidth;
  SCREEN_HEIGHT: number = window.innerHeight;

  // Colors
  WHITE: string = '#FFFFFF';
  GREEN: string = '#32C832';
  RED: string = '#C83232';
  BLACK: string = '#000000';
  GOLD: string = '#FFD700';
  COSMIC_PURPLE: string = '#2C1A3E';
  STAR_YELLOW: string = '#FFFF99';
  INPUT_ACTIVE: string = '#1E90FF'; // Dodger blue
  INPUT_INACTIVE: string = '#87CEEB'; // Light sky blue

  // Fonts
  BIG_FONT_SIZE: number = 60;
  MEDIUM_FONT_SIZE: number = 40;
  SMALL_FONT_SIZE: number = 30;

  // Puzzle data
  puzzles: { [key: string]: string } = {
    "What has keys but can't open locks?": "A piano",
    "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?": "An echo",
    "I am not alive, but I can grow. I don't have lungs, but I need air. What am I?": "Fire",
    "The more of this there is, the less you see. What is it?": "Darkness",
    "I am tall when I am young, and I am short when I am old. What am I?": "A candle",
    "What comes once in a minute, twice in a moment, but never in a thousand years?": "The letter 'M'",
    "What can travel around the world while staying in the corner?": "A stamp",
  };
  puzzleKeys: string[] = Object.keys(this.puzzles);
  currentPuzzleIndex: number = 0;
  score: number = 0;

  // Game state
  gameState: 'welcome' | 'question' | 'input' | 'feedback' | 'gameOver' = 'welcome';
  userAnswer: string = '';
  feedbackText: string = '';
  inputActive: boolean = false;
  inputBox: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 300, height: 40 };
  inputScale: number = 1.0;

  constructor() {
    this.shuffle(this.puzzleKeys);
  }

  ngAfterViewInit(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.updateCanvasSize();
    this.setupInputBox();
    this.startGame();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateCanvasSize();
    this.setupInputBox();
    this.draw();
  }

  updateCanvasSize(): void {
    if (!this.gameCanvas || !this.gameCanvas.nativeElement) return;
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = this.SCREEN_WIDTH;
    canvas.height = this.SCREEN_HEIGHT;

    // Adjust font sizes based on screen width
    this.BIG_FONT_SIZE = this.SCREEN_WIDTH * 0.04;
    this.MEDIUM_FONT_SIZE = this.SCREEN_WIDTH * 0.03;
    this.SMALL_FONT_SIZE = this.SCREEN_WIDTH * 0.015;
  }

  setupInputBox(): void {
    if (!this.gameCanvas || !this.gameCanvas.nativeElement) return;
    this.inputBox = {
      x: this.SCREEN_WIDTH / 2 - 150,
      y: this.SCREEN_HEIGHT / 2 + 50,
      width: 300,
      height: 40
    };
  }

  shuffle(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  startGame(): void {
    this.draw();
    setTimeout(() => {
      this.currentPuzzleIndex = 0;
      this.gameState = 'question';
      this.draw();
      this.showNextQuestion();
    }, 2000);
  }

  showNextQuestion(): void {
    if (this.currentPuzzleIndex >= this.puzzleKeys.length) {
      this.gameState = 'gameOver';
      this.draw();
      setTimeout(() => {
        this.currentPuzzleIndex = 0;
        this.score = 0;
        this.gameState = 'welcome';
        this.startGame();
      }, 3000);
      return;
    }

    setTimeout(() => {
      this.gameState = 'input';
      this.draw();
      if (this.userInput && this.userInput.nativeElement) {
        this.userInput.nativeElement.focus();
      }
    }, 8000);
  }

  drawBackground(): void {
    const gradient = this.ctx.createRadialGradient(
      this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, 0,
      this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, Math.max(this.SCREEN_WIDTH, this.SCREEN_HEIGHT)
    );
    gradient.addColorStop(0, this.COSMIC_PURPLE);
    gradient.addColorStop(0.5, '#3A2E5D');
    gradient.addColorStop(1, this.BLACK);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

    // Add star-like sparkles
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * this.SCREEN_WIDTH;
      const y = Math.random() * this.SCREEN_HEIGHT;
      const radius = Math.random() * 2 + 1;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.5})`;
      this.ctx.fill();
    }
  }

  displayText(text: string, fontSize: number, color: string, x: number, y: number, shadow: boolean = false): void {
    const font = `bold ${fontSize}px Poppins`;
    this.ctx.font = font;
    this.ctx.fillStyle = color;

    if (shadow) {
      this.ctx.shadowColor = this.BLACK;
      this.ctx.shadowBlur = 5;
      this.ctx.fillText(text, x, y);
      this.ctx.shadowBlur = 0;
    } else {
      this.ctx.fillText(text, x, y);
    }
  }

  wrapText(text: string, fontSize: number, maxWidth: number): string[] {
    const font = `bold ${fontSize}px Poppins`;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.font = font;

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = tempCtx.measureText(testLine).width;
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  drawInputBox(): void {
    // Pulsating animation for input box border
    this.inputScale = 1.0 + Math.sin(performance.now() / 300) * 0.05;
    const color = this.inputActive ? this.INPUT_ACTIVE : this.INPUT_INACTIVE;

    this.ctx.save();
    this.ctx.translate(this.inputBox.x + this.inputBox.width / 2, this.inputBox.y + this.inputBox.height / 2);
    this.ctx.scale(this.inputScale, this.inputScale);
    this.ctx.beginPath();
    this.ctx.rect(-this.inputBox.width / 2, -this.inputBox.height / 2, this.inputBox.width, this.inputBox.height);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.restore();
  }

  drawScore(): void {
    const scoreText = `Score: ${this.score}`;
    this.ctx.font = `bold ${this.SMALL_FONT_SIZE}px Poppins`;
    const textWidth = this.ctx.measureText(scoreText).width;
    this.displayText(scoreText, this.SMALL_FONT_SIZE, this.STAR_YELLOW, this.SCREEN_WIDTH - textWidth - 20, 20, true);
  }

  draw(): void {
    if (!this.ctx || !this.gameCanvas || !this.gameCanvas.nativeElement) return;
    this.ctx.clearRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    this.drawBackground();
    this.drawScore();

    if (this.gameState === 'welcome') {
      const welcomeText = "Welcome to the Mystery Puzzle Game!";
      this.ctx.font = `bold ${this.BIG_FONT_SIZE}px Poppins`;
      const textWidth = this.ctx.measureText(welcomeText).width;
      this.displayText(welcomeText, this.BIG_FONT_SIZE, this.GOLD, (this.SCREEN_WIDTH - textWidth) / 2, this.SCREEN_HEIGHT / 2 - 100, true);
    } else if (this.gameState === 'question') {
      const question = this.puzzleKeys[this.currentPuzzleIndex];
      const wrappedQuestion = this.wrapText(question, this.MEDIUM_FONT_SIZE, this.SCREEN_WIDTH - 40);
      let yOffset = -100;
      for (const line of wrappedQuestion) {
        this.ctx.font = `bold ${this.MEDIUM_FONT_SIZE}px Poppins`;
        const textWidth = this.ctx.measureText(line).width;
        this.displayText(line, this.MEDIUM_FONT_SIZE, this.WHITE, (this.SCREEN_WIDTH - textWidth) / 2, this.SCREEN_HEIGHT / 2 + yOffset, true);
        yOffset += 40;
      }
    } else if (this.gameState === 'input') {
      const question = this.puzzleKeys[this.currentPuzzleIndex];
      const wrappedQuestion = this.wrapText(question, this.MEDIUM_FONT_SIZE, this.SCREEN_WIDTH - 40);
      let yOffset = -100;
      for (const line of wrappedQuestion) {
        this.ctx.font = `bold ${this.MEDIUM_FONT_SIZE}px Poppins`;
        const textWidth = this.ctx.measureText(line).width;
        this.displayText(line, this.MEDIUM_FONT_SIZE, this.WHITE, (this.SCREEN_WIDTH - textWidth) / 2, this.SCREEN_HEIGHT / 2 + yOffset, true);
        yOffset += 40;
      }
      this.drawInputBox();
    } else if (this.gameState === 'feedback') {
      this.ctx.font = `bold ${this.MEDIUM_FONT_SIZE}px Poppins`;
      const textWidth = this.ctx.measureText(this.feedbackText).width;
      this.displayText(this.feedbackText, this.MEDIUM_FONT_SIZE, this.feedbackText.includes("Correct") ? this.GREEN : this.RED, (this.SCREEN_WIDTH - textWidth) / 2, this.SCREEN_HEIGHT / 2 + 50);
    } else if (this.gameState === 'gameOver') {
      const gameOverText = `Game Over! Your score: ${this.score}/${this.puzzleKeys.length * 2}`;
      this.ctx.font = `bold ${this.BIG_FONT_SIZE}px Poppins`;
      const textWidth = this.ctx.measureText(gameOverText).width;
      this.displayText(gameOverText, this.BIG_FONT_SIZE, this.GOLD, (this.SCREEN_WIDTH - textWidth) / 2, this.SCREEN_HEIGHT / 2 + 100, true);
    }
  }

  onInputFocus(): void {
    this.inputActive = true;
    this.draw();
  }

  onInputBlur(): void {
    this.inputActive = false;
    this.draw();
  }

  onInputChange(event: Event): void {
    this.userAnswer = (event.target as HTMLInputElement).value;
    this.draw();
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submitAnswer();
    }
  }

  submitAnswer(): void {
    if (this.gameState !== 'input') return;

    const correctAnswer = this.puzzles[this.puzzleKeys[this.currentPuzzleIndex]];
    if (this.userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      this.score += 2; // Award 2 points for correct answer
      this.feedbackText = "Correct!";
    } else {
      this.feedbackText = `Wrong! The correct answer is: ${correctAnswer}`;
    }

    this.gameState = 'feedback';
    this.draw();
    this.userAnswer = '';
    if (this.userInput && this.userInput.nativeElement) {
      this.userInput.nativeElement.value = '';
    }
    this.inputActive = false;

    setTimeout(() => {
      this.currentPuzzleIndex++;
      this.gameState = 'question';
      this.draw();
      this.showNextQuestion();
    }, 2000);
  }
}