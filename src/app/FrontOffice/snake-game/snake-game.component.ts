import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  gameState: 'waiting' | 'playing' | 'gameOver' = 'waiting';
  score: number = 0;
  highScore: number = 0;
  showScoreUpdateError: boolean = false; // Added for error display

  // Game settings
  private CANVAS_WIDTH = 800;
  private CANVAS_HEIGHT = 600;
  private SNAKE_SIZE = 20;
  private GAME_SPEED = 120;

  // Game state
  private snake: Position[] = [{ x: 400, y: 300 }];
  private food: Position = { x: 200, y: 200 };
  private direction: Position = { x: 0, y: 0 };
  private gameLoopInterval: any = null;

  constructor(private userService: UserService) { // Inject UserService
    this.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
  }

  ngOnInit(): void {
    this.drawBackground();
  }

  ngOnDestroy(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (this.gameState === 'waiting' && event.key.toLowerCase() === 's') {
      this.startGame();
    } else if (this.gameState === 'gameOver' && event.key.toLowerCase() === 'r') {
      this.resetGame();
    } else if (this.gameState === 'playing') {
      const { x, y } = this.direction;
      switch (event.key) {
        case 'ArrowUp':
          if (y === 0) this.direction = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (y === 0) this.direction = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (x === 0) this.direction = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (x === 0) this.direction = { x: 1, y: 0 };
          break;
      }
    }
  }

  private generateFood(): Position {
    return {
      x: Math.floor(Math.random() * (this.CANVAS_WIDTH / this.SNAKE_SIZE)) * this.SNAKE_SIZE,
      y: Math.floor(Math.random() * (this.CANVAS_HEIGHT / this.SNAKE_SIZE)) * this.SNAKE_SIZE
    };
  }

  private drawBackground(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.CANVAS_WIDTH; i += this.SNAKE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= this.CANVAS_HEIGHT; i += this.SNAKE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw score update error if needed
    if (this.showScoreUpdateError) {
      ctx.font = 'bold 24px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ff4444';
      ctx.textAlign = 'center';
      ctx.fillText("Error updating score", this.CANVAS_WIDTH / 2, 50);
    }
  }

  private drawSnake(ctx: CanvasRenderingContext2D): void {
    this.snake.forEach((segment, index) => {
      const isHead = index === this.snake.length - 1;
      const gradient = ctx.createRadialGradient(
        segment.x + this.SNAKE_SIZE / 2, segment.y + this.SNAKE_SIZE / 2, 0,
        segment.x + this.SNAKE_SIZE / 2, segment.y + this.SNAKE_SIZE / 2, this.SNAKE_SIZE / 2
      );

      if (isHead) {
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(1, '#00cc66');
      } else {
        gradient.addColorStop(0, '#00dd77');
        gradient.addColorStop(1, '#00aa55');
      }

      ctx.fillStyle = gradient;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = isHead ? 15 : 10;

      ctx.beginPath();
      ctx.roundRect(segment.x + 1, segment.y + 1, this.SNAKE_SIZE - 2, this.SNAKE_SIZE - 2, 8);
      ctx.fill();

      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        const eyeSize = 4;
        const eyeOffset = 6;
        ctx.beginPath();
        ctx.arc(segment.x + eyeOffset, segment.y + eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(segment.x + this.SNAKE_SIZE - eyeOffset, segment.y + eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(segment.x + eyeOffset, segment.y + eyeOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(segment.x + this.SNAKE_SIZE - eyeOffset, segment.y + eyeOffset, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    });
  }

  private drawFood(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.food;
    const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 1;

    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 20 * pulse;

    const gradient = ctx.createRadialGradient(
      x + this.SNAKE_SIZE / 2, y + this.SNAKE_SIZE / 2, 0,
      x + this.SNAKE_SIZE / 2, y + this.SNAKE_SIZE / 2, this.SNAKE_SIZE / 2
    );
    gradient.addColorStop(0, '#ff6666');
    gradient.addColorStop(1, '#cc2222');

    ctx.fillStyle = gradient;
    ctx.beginPath();
      ctx.arc(x + this.SNAKE_SIZE / 2, y + this.SNAKE_SIZE / 2, (this.SNAKE_SIZE / 2 - 2) * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + this.SNAKE_SIZE / 2 - 3, y + this.SNAKE_SIZE / 2 - 3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    private drawScore(ctx: CanvasRenderingContext2D): void {
      ctx.font = 'bold 28px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 5;
      ctx.fillText(`Score: ${this.score}`, 20, 40);

      ctx.font = 'bold 20px "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffdd44';
      ctx.fillText(`High Score: ${this.highScore}`, 20, 70);
      ctx.shadowBlur = 0;
    }

    private checkCollision(): boolean {
      const head = this.snake[this.snake.length - 1];
      if (head.x < 0 || head.x >= this.CANVAS_WIDTH || head.y < 0 || head.y >= this.CANVAS_HEIGHT) {
        return true;
      }
      for (let i = 0; i < this.snake.length - 1; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          return true;
        }
      }
      return false;
    }

    private updateUserScore(): void {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.userService.updateScore_u(+userId, this.score).subscribe({
          next: () => {
            console.log('Score updated successfully');
          },
          error: (error) => {
            console.error('Error updating score', error);
            this.showScoreUpdateError = true;
            setTimeout(() => {
              this.showScoreUpdateError = false;
              this.drawBackground();
            }, 3000);
          }
        });
      }
    }

    private gameLoop(): void {
      const ctx = this.canvasRef.nativeElement.getContext('2d');
      if (!ctx) return;

      const head = { ...this.snake[this.snake.length - 1] };
      head.x += this.direction.x * this.SNAKE_SIZE;
      head.y += this.direction.y * this.SNAKE_SIZE;

      this.snake.push(head);

      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 1;
        this.food = this.generateFood();
      } else {
        this.snake.shift();
      }

      if (this.checkCollision()) {
        this.gameState = 'gameOver';
        if (this.gameLoopInterval) {
          clearInterval(this.gameLoopInterval);
        }
        this.updateUserScore(); // Call to update user score when game ends
        return;
      }

      this.drawBackground();
      this.drawFood(ctx);
      this.drawSnake(ctx);
      this.drawScore(ctx);
    }

    startGame(): void {
      this.gameState = 'playing';
      this.snake = [{ x: 400, y: 300 }];
      this.direction = { x: 1, y: 0 };
      this.food = this.generateFood();
      this.score = 0;
      this.showScoreUpdateError = false;
      this.gameLoopInterval = setInterval(() => this.gameLoop(), this.GAME_SPEED);
    }

    resetGame(): void {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snakeHighScore', this.highScore.toString());
      }
      this.gameState = 'waiting';
      if (this.gameLoopInterval) {
        clearInterval(this.gameLoopInterval);
      }
      this.drawBackground();
    }
  }