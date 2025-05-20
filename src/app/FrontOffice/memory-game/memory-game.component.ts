import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // Game settings
  SIZE = 6;
  CARD_SIZE!: number; // Will be calculated dynamically
  MARGIN!: number; // Will be calculated dynamically
  SCREEN_WIDTH!: number; // Will match window width
  SCREEN_HEIGHT!: number; // Will match window height

  // Colors
  BG_GRADIENT_TOP = { r: 20, g: 30, b: 50 };
  BG_GRADIENT_BOTTOM = { r: 10, g: 20, b: 40 };
  WHITE = '#FFFFFF';
  GRAY = '#B4B4B4';
  LIGHT_GRAY = '#DCDCDC';
  GOLD = '#FFD700';
  GREEN = '#32C832';
  RED = '#C83232';

  // Game state
  board: number[][] = [];
  revealed: boolean[][] = [];
  selected: [number, number][] = [];
  matches: number = 0;
  totalPairs: number = (this.SIZE * this.SIZE) / 2;
  gameOver: boolean = false;
  playAgainButton: { x: number, y: number, width: number, height: number } | null = null;

  constructor() {
    this.updateCanvasSize(); // Set initial size
    this.resetGame();
  }

  ngAfterViewInit(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.drawBoard();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateCanvasSize();
    this.drawBoard();
  }

  updateCanvasSize(): void {
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;

    const canvas = this.gameCanvas?.nativeElement;
    if (canvas) {
      canvas.width = this.SCREEN_WIDTH;
      canvas.height = this.SCREEN_HEIGHT;
    }

    // Calculate card size and margin based on screen width
    const boardWidth = Math.min(this.SCREEN_WIDTH, this.SCREEN_HEIGHT - 100); // Reserve space for score
    this.MARGIN = boardWidth * 0.02; // 2% of board width
    this.CARD_SIZE = (boardWidth - this.MARGIN * (this.SIZE + 1)) / this.SIZE;
  }

  createBoard(size: number): number[][] {
    const numbers = Array.from({ length: (size * size) / 2 }, (_, i) => i + 1).flatMap(num => [num, num]);
    this.shuffle(numbers);
    const board: number[][] = [];
    for (let i = 0; i < size; i++) {
      board.push(numbers.slice(i * size, (i + 1) * size));
    }
    return board;
  }

  shuffle(array: number[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  resetGame(): void {
    this.board = this.createBoard(this.SIZE);
    this.revealed = Array(this.SIZE).fill(null).map(() => Array(this.SIZE).fill(false));
    this.selected = [];
    this.matches = 0;
    this.gameOver = false;
    this.playAgainButton = null;
    if (this.ctx) {
      this.drawBoard();
    }
  }

  drawGradient(): void {
    for (let y = 0; y < this.SCREEN_HEIGHT; y++) {
      const ratio = y / this.SCREEN_HEIGHT;
      const r = this.BG_GRADIENT_TOP.r + (this.BG_GRADIENT_BOTTOM.r - this.BG_GRADIENT_TOP.r) * ratio;
      const g = this.BG_GRADIENT_TOP.g + (this.BG_GRADIENT_BOTTOM.g - this.BG_GRADIENT_TOP.g) * ratio;
      const b = this.BG_GRADIENT_TOP.b + (this.BG_GRADIENT_BOTTOM.b - this.BG_GRADIENT_TOP.b) * ratio;
      this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.SCREEN_WIDTH, y);
      this.ctx.stroke();
    }
  }

  drawBoard(): void {
    this.ctx.clearRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    this.drawGradient();

    const boardWidth = Math.min(this.SCREEN_WIDTH, this.SCREEN_HEIGHT - 100);
    const boardX = (this.SCREEN_WIDTH - boardWidth) / 2; // Center the board horizontally
    const boardY = (this.SCREEN_HEIGHT - boardWidth - 100) / 2; // Center vertically, leave space for score

    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const x = boardX + j * (this.CARD_SIZE + this.MARGIN) + this.MARGIN;
        const y = boardY + i * (this.CARD_SIZE + this.MARGIN) + this.MARGIN;

        // Shadow effect
        this.ctx.fillStyle = this.GRAY;
        this.roundedRect(x + 5, y + 5, this.CARD_SIZE, this.CARD_SIZE, 15);
        this.ctx.fill();

        // Card
        this.ctx.fillStyle = this.revealed[i][j] ? this.WHITE : this.LIGHT_GRAY;
        this.roundedRect(x, y, this.CARD_SIZE, this.CARD_SIZE, 15);
        this.ctx.fill();

        if (this.revealed[i][j]) {
          this.ctx.fillStyle = this.GOLD;
          this.ctx.font = `${this.CARD_SIZE / 3}px Arial`; // Scale font with card size
          this.ctx.fillText(this.board[i][j].toString(), x + this.CARD_SIZE / 3, y + this.CARD_SIZE / 1.5);
        }
      }
    }

    // Draw score
    this.ctx.fillStyle = this.WHITE;
    this.ctx.font = `${this.SCREEN_WIDTH / 40}px Arial`; // Scale font with screen width
    this.ctx.fillText(`Matches: ${this.matches}/${this.totalPairs}`, 20, this.SCREEN_HEIGHT - 30);
  }

  drawWinScreen(): void {
    this.ctx.fillStyle = this.GREEN;
    this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

    this.ctx.fillStyle = this.WHITE;
    this.ctx.font = `${this.SCREEN_WIDTH / 20}px Arial`;
    this.ctx.fillText('🎉 You Win! 🎉', this.SCREEN_WIDTH / 3.5, this.SCREEN_HEIGHT / 3);

    // Draw play again button
    const buttonWidth = this.SCREEN_WIDTH / 5;
    const buttonHeight = this.SCREEN_HEIGHT / 10;
    const buttonX = (this.SCREEN_WIDTH - buttonWidth) / 2;
    const buttonY = this.SCREEN_HEIGHT / 2;

    this.ctx.fillStyle = this.RED;
    this.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
    this.ctx.fill();

    this.ctx.strokeStyle = this.WHITE;
    this.ctx.lineWidth = 4;
    this.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
    this.ctx.stroke();

    this.ctx.fillStyle = this.WHITE;
    this.ctx.font = `${buttonHeight / 2}px Arial`;
    this.ctx.fillText('Play Again', buttonX + buttonWidth / 4, buttonY + buttonHeight / 1.5);

    this.playAgainButton = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
  }

  roundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
  }

  handleClick(event: MouseEvent): void {
    const canvas = this.gameCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    if (this.gameOver && this.playAgainButton) {
      const { x, y, width, height } = this.playAgainButton;
      if (mx >= x && mx <= x + width && my >= y && my <= y + height) {
        this.resetGame();
        this.drawBoard();
      }
    } else if (this.selected.length < 2) {
      const boardWidth = Math.min(this.SCREEN_WIDTH, this.SCREEN_HEIGHT - 100);
      const boardX = (this.SCREEN_WIDTH - boardWidth) / 2;
      const boardY = (this.SCREEN_HEIGHT - boardWidth - 100) / 2;

      const row = Math.floor((my - boardY) / (this.CARD_SIZE + this.MARGIN));
      const col = Math.floor((mx - boardX) / (this.CARD_SIZE + this.MARGIN));

      if (row >= 0 && row < this.SIZE && col >= 0 && col < this.SIZE && !this.revealed[row][col]) {
        this.revealed[row][col] = true;
        this.selected.push([row, col]);
        this.drawBoard();

        if (this.selected.length === 2) {
          setTimeout(() => {
            const [r1, c1] = this.selected[0];
            const [r2, c2] = this.selected[1];

            if (this.board[r1][c1] === this.board[r2][c2]) {
              this.matches++;
            } else {
              this.revealed[r1][c1] = false;
              this.revealed[r2][c2] = false;
            }

            this.selected = [];
            this.drawBoard();

            if (this.matches === this.totalPairs) {
              this.gameOver = true;
              this.drawWinScreen();
            }
          }, 500);
        }
      }
    }
  }
}