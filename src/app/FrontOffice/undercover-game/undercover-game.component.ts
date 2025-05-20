import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-undercover-game',
  templateUrl: './undercover-game.component.html',
  styleUrls: ['./undercover-game.component.css']
})
export class UndercoverGameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // Screen setup
  SCREEN_WIDTH: number = 0;
  SCREEN_HEIGHT: number = 0;

  // Colors
  DARK_BLUE = '#0F2037';
  GOLD = '#D4AF37';
  GREEN = '#2ECC71';
  WHITE = '#FFFFFF';
  LIGHT_GRAY = '#DCDCDC';
  RED = '#E74C3C';
  BLUE = '#3498DB';
  PURPLE = '#9B59B6';
  BLACK = '#000000';

  // Game state
  game!: Game;

  ngAfterViewInit(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.updateCanvasSize();
    this.game = new Game(this);
    this.game.run();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateCanvasSize();
    this.game.draw();
  }

  updateCanvasSize(): void {
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = this.SCREEN_WIDTH;
    canvas.height = this.SCREEN_HEIGHT;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
  }

  drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
  }

  // Public methods to access ctx
  setFillStyle(color: string): void {
    this.ctx.fillStyle = color;
  }

  setStrokeStyle(color: string): void {
    this.ctx.strokeStyle = color;
  }

  setLineWidth(width: number): void {
    this.ctx.lineWidth = width;
  }

  beginPath(): void {
    this.ctx.beginPath();
  }

  moveTo(x: number, y: number): void {
    this.ctx.moveTo(x, y);
  }

  lineTo(x: number, y: number): void {
    this.ctx.lineTo(x, y);
  }

  stroke(): void {
    this.ctx.stroke();
  }

  fill(): void {
    this.ctx.fill();
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
    this.ctx.arc(x, y, radius, startAngle, endAngle);
  }

  drawImage(image: CanvasImageSource, dx: number, dy: number): void {
    this.ctx.drawImage(image, dx, dy);
  }
}

class Player {
  name: string;
  role: string;
  secretWord: string | null = null;
  alive: boolean = true;
  cardScale: number = 1.0;
  targetScale: number = 1.0;
  animationSpeed: number = 0.1;

  constructor(name: string, role: string, secretWord: string | null = null) {
    this.name = name;
    this.role = role;
    this.secretWord = secretWord;
  }

  update(): void {
    if (Math.abs(this.cardScale - this.targetScale) > 0.01) {
      this.cardScale += (this.targetScale - this.cardScale) * this.animationSpeed;
    } else {
      this.cardScale = this.targetScale;
    }
  }

  draw(game: UndercoverGameComponent, x: number, y: number, width: number, height: number, selected: boolean = false): void {
    const color = { Civilian: game.BLUE, Undercover: game.RED, 'Mr.White': game.PURPLE }[this.role] || game.WHITE;
    const borderColor = selected ? game.GOLD : game.BLACK;
    const borderWidth = selected ? 4 : 2;

    const scaledWidth = width * this.cardScale;
    const scaledHeight = height * this.cardScale;
    const cardRect = {
      x: x + (width - scaledWidth) / 2,
      y: y + (height - scaledHeight) / 2,
      width: scaledWidth,
      height: scaledHeight
    };

    // Shadow
    game.setFillStyle('rgba(0, 0, 0, 0.3)');
    game.drawRoundedRect(cardRect.x + 8, cardRect.y + 8, cardRect.width, cardRect.height, 12);
    game.fill();

    // Card
    game.setFillStyle(color);
    game.drawRoundedRect(cardRect.x, cardRect.y, cardRect.width, cardRect.height, 12);
    game.fill();
    game.setLineWidth(borderWidth);
    game.setStrokeStyle(borderColor);
    game.drawRoundedRect(cardRect.x, cardRect.y, cardRect.width, cardRect.height, 12);
    game.stroke();

    // Text
    const textColor = this.role !== 'Mr.White' ? game.WHITE : game.GOLD;
    const nameText = this.getText('24px Arial', this.name, textColor);
    const roleText = this.getText('32px Arial', this.role, textColor);

    game.drawImage(nameText, cardRect.x + (cardRect.width - (nameText as HTMLCanvasElement).width) / 2, cardRect.y + 15);
    game.drawImage(roleText, cardRect.x + (cardRect.width - (roleText as HTMLCanvasElement).width) / 2, cardRect.y + cardRect.height / 2 - 15);

    if (this.alive && this.role !== 'Mr.White' && this.secretWord) {
      const wordText = this.getText('24px Arial', `Word: ${this.secretWord}`, textColor);
      const textY = this.role === 'Civilian' ? cardRect.y + 30 : cardRect.y + 60;
      game.drawImage(wordText, cardRect.x + (cardRect.width - (wordText as HTMLCanvasElement).width) / 2, textY);
    }

    if (!this.alive) {
      game.setLineWidth(3);
      game.setStrokeStyle(game.BLACK);
      game.beginPath();
      game.moveTo(cardRect.x + 15, cardRect.y + 15);
      game.lineTo(cardRect.x + cardRect.width - 15, cardRect.y + cardRect.height - 15);
      game.moveTo(cardRect.x + 15, cardRect.y + cardRect.height - 15);
      game.lineTo(cardRect.x + cardRect.width - 15, cardRect.y + 15);
      game.stroke();
    }
  }

  private getText(font: string, text: string, color: string): CanvasImageSource {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.font = font;
    const width = tempCtx.measureText(text).width;
    const height = parseInt(font) || 32;
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.font = font;
    tempCtx.fillStyle = color;
    tempCtx.fillText(text, 0, height - 8);
    return tempCanvas;
  }
}

class Game {
  players: Player[] = [];
  gameState: string = 'setup';
  wordPairs: [string, string][] = [
    ['Cat', 'Dog'], ['Apple', 'Orange'], ['Car', 'Bike'], ['Pizza', 'Burger'],
    ['Beach', 'Mountain'], ['Vampire', 'Werewolf'], ['Coffee', 'Tea'], ['Football', 'Basketball']
  ];
  currentRound: number = 1;
  selectedPlayer: Player | null = null;
  dragging: string | null = null;
  sliders: { [key: string]: { rect: { x: number, y: number, width: number, height: number }, value: number, min: number, max: number, snap: boolean, dragging: boolean } } = {};
  buttons: { [key: string]: { rect: { x: number, y: number, width: number, height: number }, text: string } } = {};

  // Colors
  private GOLD: string;
  private GREEN: string;
  private WHITE: string;
  private LIGHT_GRAY: string;
  private RED: string;
  private BLACK: string;

  constructor(private gameComponent: UndercoverGameComponent) {
    this.GOLD = gameComponent.GOLD;
    this.GREEN = gameComponent.GREEN;
    this.WHITE = gameComponent.WHITE;
    this.LIGHT_GRAY = gameComponent.LIGHT_GRAY;
    this.RED = gameComponent.RED;
    this.BLACK = gameComponent.BLACK;
    this.setupUI();
  }

  setupUI(): void {
    this.buttons = {
      start: { rect: { x: this.gameComponent.SCREEN_WIDTH / 2 - 150, y: this.gameComponent.SCREEN_HEIGHT - 100, width: 300, height: 60 }, text: 'START GAME' },
      next: { rect: { x: this.gameComponent.SCREEN_WIDTH - 200, y: this.gameComponent.SCREEN_HEIGHT - 80, width: 180, height: 50 }, text: 'CONTINUE' },
      vote: { rect: { x: this.gameComponent.SCREEN_WIDTH / 2 - 100, y: this.gameComponent.SCREEN_HEIGHT - 80, width: 200, height: 50 }, text: 'VOTE' },
      restart: { rect: { x: this.gameComponent.SCREEN_WIDTH / 2 - 150, y: 200, width: 300, height: 60 }, text: 'BACK TO SETUP' }
    };

    this.sliders = {      
      civilians: { rect: { x: this.gameComponent.SCREEN_WIDTH / 2 - 200, y: 200, width: 400, height: 30 }, value: 3, min: 3, max: 10, snap: true, dragging: false },
      undercovers: { rect: { x: this.gameComponent.SCREEN_WIDTH / 2 - 200, y: 300, width: 400, height: 30 }, value: 2, min: 1, max: 5, snap: true, dragging: false },
      mr_whites: { rect: { x: this.gameComponent.SCREEN_WIDTH / 2 - 200, y: 400, width: 400, height: 30 }, value: 1, min: 0, max: 2, snap: true, dragging: false }
    };
  }

  resetGame(): void {
    this.players = [];
    this.gameState = 'setup';
    this.currentRound = 1;
    this.selectedPlayer = null;
    this.dragging = null;
    this.setupUI();
    this.draw();
  }

  setupGame(): void {
    const [civilianWord, undercoverWord] = this.wordPairs[Math.floor(Math.random() * this.wordPairs.length)];
    this.players = [];

    for (let i = 1; i <= this.sliders['civilians'].value; i++) {
      this.players.push(new Player(`Player ${i}`, 'Civilian', civilianWord));
    }
    for (let i = this.sliders['civilians'].value + 1; i <= this.sliders['civilians'].value + this.sliders['undercovers'].value; i++) {
      this.players.push(new Player(`Player ${i}`, 'Undercover', undercoverWord));
    }
    for (let i = this.sliders['civilians'].value + this.sliders['undercovers'].value + 1; i <= this.sliders['civilians'].value + this.sliders['undercovers'].value + this.sliders['mr_whites'].value; i++) {
      this.players.push(new Player(`Player ${i}`, 'Mr.White'));
    }
  }

  draw(): void {
    this.gameComponent.clear();
    if (this.gameState === 'setup') {
      this.drawSetupScreen();
    } else if (this.gameState.includes('win')) {
      this.drawWinScreen(this.gameState.replace('_win', ''));
    } else {
      this.drawGameScreen();
    }
  }

  drawSetupScreen(): void {
    // Gradient background
    for (let y = 0; y < this.gameComponent.SCREEN_HEIGHT; y++) {
      const color = `rgb(${15}, ${Math.min(55, 32 + y / 25)}, ${Math.min(100, 55 + y / 15)})`;
      this.gameComponent.setStrokeStyle(color);
      this.gameComponent.beginPath();
      this.gameComponent.moveTo(0, y);
      this.gameComponent.lineTo(this.gameComponent.SCREEN_WIDTH, y);
      this.gameComponent.stroke();
    }

    // Title
    const title = this.getText('72px Arial', 'UNDERCOVER GAME', this.GOLD);
    this.gameComponent.drawImage(title, (this.gameComponent.SCREEN_WIDTH - (title as HTMLCanvasElement).width) / 2, 50);

    // Instructions
    const instruction = this.getText('48px Arial', 'SETUP YOUR GAME', this.WHITE);
    this.gameComponent.drawImage(instruction, (this.gameComponent.SCREEN_WIDTH - (instruction as HTMLCanvasElement).width) / 2, 120);

    // Draw sliders
    for (const name in this.sliders) {
      const slider = this.sliders[name];
      this.gameComponent.setFillStyle(this.LIGHT_GRAY);
      this.gameComponent.drawRoundedRect(slider.rect.x, slider.rect.y, slider.rect.width, slider.rect.height, 15);
      this.gameComponent.fill();
      this.gameComponent.setStrokeStyle('#B4B4B4');
      this.gameComponent.setLineWidth(2);
      this.gameComponent.drawRoundedRect(slider.rect.x, slider.rect.y, slider.rect.width, slider.rect.height, 15);
      this.gameComponent.stroke();

      const ratio = (slider.value - slider.min) / (slider.max - slider.min);
      const thumbX = slider.rect.x + ratio * slider.rect.width;
      
      // Thumb shadow
      this.gameComponent.setFillStyle('rgba(0,0,0,0.2)');
      this.gameComponent.beginPath();
      this.gameComponent.arc(thumbX + 2, slider.rect.y + slider.rect.height / 2 + 2, 16, 0, Math.PI * 2);
      this.gameComponent.fill();

      // Thumb
      const thumbColor = slider.dragging ? this.GOLD : '#C8C8C8';
      this.gameComponent.setFillStyle(thumbColor);
      this.gameComponent.beginPath();
      this.gameComponent.arc(thumbX, slider.rect.y + slider.rect.height / 2, 16, 0, Math.PI * 2);
      this.gameComponent.fill();
      this.gameComponent.setFillStyle(slider.dragging ? this.GOLD : '#F0F0F0');
      this.gameComponent.beginPath();
      this.gameComponent.arc(thumbX, slider.rect.y + slider.rect.height / 2, 14, 0, Math.PI * 2);
      this.gameComponent.fill();
      this.gameComponent.setStrokeStyle(this.BLACK);
      this.gameComponent.setLineWidth(1);
      this.gameComponent.beginPath();
      this.gameComponent.arc(thumbX, slider.rect.y + slider.rect.height / 2, 14, 0, Math.PI * 2);
      this.gameComponent.stroke();

      // Active track
      this.gameComponent.setFillStyle(this.GOLD);
      this.gameComponent.drawRoundedRect(slider.rect.x, slider.rect.y, thumbX - slider.rect.x, slider.rect.height, 15);
      this.gameComponent.fill();

      // Label
      const label = this.getText('32px Arial', `${name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ')}: ${slider.value}`, this.WHITE);
      this.gameComponent.drawImage(label, slider.rect.x, slider.rect.y - 40);
    }

    // Start button
    const mousePos = this.getMousePos();
    const hovered = this.isPointInRect(mousePos, this.buttons['start'].rect);
    const buttonColor = hovered ? '#38E07B' : this.GREEN;
    this.gameComponent.setFillStyle(buttonColor);
    this.gameComponent.drawRoundedRect(this.buttons['start'].rect.x, this.buttons['start'].rect.y, this.buttons['start'].rect.width, this.buttons['start'].rect.height, 30);
    this.gameComponent.fill();
    this.gameComponent.setStrokeStyle(this.WHITE);
    this.gameComponent.setLineWidth(3);
    this.gameComponent.drawRoundedRect(this.buttons['start'].rect.x, this.buttons['start'].rect.y, this.buttons['start'].rect.width, this.buttons['start'].rect.height, 30);
    this.gameComponent.stroke();

    const startText = this.getText('32px Arial', this.buttons['start'].text, this.WHITE);
    this.gameComponent.drawImage(startText, this.buttons['start'].rect.x + (this.buttons['start'].rect.width - (startText as HTMLCanvasElement).width) / 2, this.buttons['start'].rect.y + (this.buttons['start'].rect.height - (startText as HTMLCanvasElement).height) / 2);
  }

  drawGameScreen(): void {
    // Animated background
    for (let y = 0; y < this.gameComponent.SCREEN_HEIGHT; y += 3) {
      const alpha = Math.min(255, Math.abs(this.gameComponent.SCREEN_HEIGHT / 2 - y));
      const color = `rgba(${15}, ${32}, ${Math.min(100, 55 + (this.gameComponent.SCREEN_HEIGHT - y) / 20)}, ${alpha / 255})`;
      this.gameComponent.setStrokeStyle(color);
      this.gameComponent.beginPath();
      this.gameComponent.moveTo(0, y);
      this.gameComponent.lineTo(this.gameComponent.SCREEN_WIDTH, y);
      this.gameComponent.stroke();
    }

    // Title and round
    const title = this.getText('72px Arial', 'UNDERCOVER', this.GOLD);
    const subtitle = this.getText('24px Arial', `Round ${this.currentRound}`, this.WHITE);
    this.gameComponent.drawImage(title, (this.gameComponent.SCREEN_WIDTH - (title as HTMLCanvasElement).width) / 2, 20);
    this.gameComponent.drawImage(subtitle, (this.gameComponent.SCREEN_WIDTH - (subtitle as HTMLCanvasElement).width) / 2, 90);

    // Current phase
    const phaseText = this.getText('48px Arial', this.gameState.toUpperCase(), this.WHITE);
    this.gameComponent.drawImage(phaseText, (this.gameComponent.SCREEN_WIDTH - (phaseText as HTMLCanvasElement).width) / 2, 140);

    // Draw player cards
    const alivePlayers = this.players.filter(p => p.alive);
    if (alivePlayers.length > 0) {
      const cardWidth = Math.min(200, (this.gameComponent.SCREEN_WIDTH - 100) / Math.max(4, alivePlayers.length));
      const cardHeight = 300;
      const cardSpacing = 20;

      for (let i = 0; i < alivePlayers.length; i++) {
        alivePlayers[i].update();
        const x = this.gameComponent.SCREEN_WIDTH / 2 - (alivePlayers.length * (cardWidth + cardSpacing)) / 2 + i * (cardWidth + cardSpacing);
        const y = this.gameComponent.SCREEN_HEIGHT / 2 - cardHeight / 2;
        alivePlayers[i].draw(this.gameComponent, x, y, cardWidth, cardHeight, alivePlayers[i] === this.selectedPlayer);
      }
    }

    // Instructions
    const instruction = this.getText('32px Arial', this.getInstruction(), this.WHITE);
    this.gameComponent.drawImage(instruction, (this.gameComponent.SCREEN_WIDTH - (instruction as HTMLCanvasElement).width) / 2, this.gameComponent.SCREEN_HEIGHT - 180);

    if (this.gameState === 'voting' && this.selectedPlayer) {
      const voteText = this.getText('32px Arial', `Voting to eliminate: ${this.selectedPlayer.name}`, this.RED);
      this.gameComponent.drawImage(voteText, (this.gameComponent.SCREEN_WIDTH - (voteText as HTMLCanvasElement).width) / 2, this.gameComponent.SCREEN_HEIGHT - 140);
    }

    // Action button
    const buttonKey = this.gameState === 'voting' ? 'vote' : 'next';
    const button = this.buttons[buttonKey];
    const mousePos = this.getMousePos();
    const hovered = this.isPointInRect(mousePos, button.rect);
    const buttonColor = buttonKey === 'vote' ? this.RED : (hovered ? '#38E07B' : this.GREEN);

    this.gameComponent.setFillStyle(buttonColor);
    this.gameComponent.drawRoundedRect(button.rect.x, button.rect.y, button.rect.width, button.rect.height, 25);
    this.gameComponent.fill();
    this.gameComponent.setStrokeStyle(this.WHITE);
    this.gameComponent.setLineWidth(3);
    this.gameComponent.drawRoundedRect(button.rect.x, button.rect.y, button.rect.width, button.rect.height, 25);
    this.gameComponent.stroke();

    const buttonText = this.getText('32px Arial', button.text, this.WHITE);
    this.gameComponent.drawImage(buttonText, button.rect.x + (button.rect.width - (buttonText as HTMLCanvasElement).width) / 2, button.rect.y + (button.rect.height - (buttonText as HTMLCanvasElement).height) / 2);
  }

  drawWinScreen(winner: string): void {
    // Gradient background
    for (let y = 0; y < this.gameComponent.SCREEN_HEIGHT; y++) {
      const color = `rgb(${Math.min(255, 15 + y / 3)}, ${Math.min(255, 32 + y / 6)}, ${Math.min(255, 55 + y / 4)})`;
      this.gameComponent.setStrokeStyle(color);
      this.gameComponent.beginPath();
      this.gameComponent.moveTo(0, y);
      this.gameComponent.lineTo(this.gameComponent.SCREEN_WIDTH, y);
      this.gameComponent.stroke();
    }

    // Winner announcement (immediate, no timer)
    const winnerText = this.getText('72px Arial', `${winner} WINS!`, this.GOLD);
    this.gameComponent.drawImage(winnerText, (this.gameComponent.SCREEN_WIDTH - (winnerText as HTMLCanvasElement).width) / 2, 100);

    // Back to setup button (below win message)
    const mousePos = this.getMousePos();
    const hovered = this.isPointInRect(mousePos, this.buttons['restart'].rect);
    const buttonColor = hovered ? '#38E07B' : this.GREEN;

    this.gameComponent.setFillStyle(buttonColor);
    this.gameComponent.drawRoundedRect(this.buttons['restart'].rect.x, this.buttons['restart'].rect.y, this.buttons['restart'].rect.width, this.buttons['restart'].rect.height, 30);
    this.gameComponent.fill();
    this.gameComponent.setStrokeStyle(this.WHITE);
    this.gameComponent.setLineWidth(3);
    this.gameComponent.drawRoundedRect(this.buttons['restart'].rect.x, this.buttons['restart'].rect.y, this.buttons['restart'].rect.width, this.buttons['restart'].rect.height, 30);
    this.gameComponent.stroke();

    const againText = this.getText('32px Arial', 'BACK TO SETUP', this.WHITE);
    this.gameComponent.drawImage(againText, this.buttons['restart'].rect.x + (this.buttons['restart'].rect.width - (againText as HTMLCanvasElement).width) / 2, this.buttons['restart'].rect.y + (this.buttons['restart'].rect.height - (againText as HTMLCanvasElement).height) / 2);
  }

  handleEvents(event: MouseEvent): boolean {
    const mousePos = this.getMousePos(event);

    if (event.type === 'mousedown') {
      if (this.gameState === 'setup') {
        for (const name in this.sliders) {
          const slider = this.sliders[name];
          const ratio = (slider.value - slider.min) / (slider.max - slider.min);
          const thumbX = slider.rect.x + ratio * slider.rect.width;
          const thumbRect = { x: thumbX - 20, y: slider.rect.y - 20, width: 40, height: 40 };

          if (this.isPointInRect(mousePos, thumbRect)) {
            this.dragging = name;
            slider.dragging = true;
            break;
          }
        }
      }
    }
    else if (event.type === 'click') {
      if (this.gameState === 'setup') {
        if (this.isPointInRect(mousePos, this.buttons['start'].rect)) {
          this.setupGame();
          this.gameState = 'description';
          this.draw();
          return true;
        }
      } else if (this.gameState.includes('win')) {
        if (this.isPointInRect(mousePos, this.buttons['restart'].rect)) {
          this.resetGame();
          return true;
        }
      } else if (this.gameState === 'voting') {
        const alivePlayers = this.players.filter(p => p.alive);
        if (alivePlayers.length > 0) {
          const cardWidth = Math.min(200, (this.gameComponent.SCREEN_WIDTH - 100) / Math.max(4, alivePlayers.length));
          const cardHeight = 300;
          const cardSpacing = 20;

          for (let i = 0; i < alivePlayers.length; i++) {
            const x = this.gameComponent.SCREEN_WIDTH / 2 - (alivePlayers.length * (cardWidth + cardSpacing)) / 2 + i * (cardWidth + cardSpacing);
            const y = this.gameComponent.SCREEN_HEIGHT / 2 - cardHeight / 2;
            const cardRect = { x, y, width: cardWidth, height: cardHeight };

            if (this.isPointInRect(mousePos, cardRect)) {
              this.selectedPlayer = alivePlayers[i];
              this.draw();
              break;
            }
          }
        }
      }

      const buttonKey = this.gameState === 'voting' ? 'vote' : 'next';
      if (this.isPointInRect(mousePos, this.buttons[buttonKey].rect)) {
        if (this.gameState === 'description') {
          this.gameState = 'discussion';
        } else if (this.gameState === 'discussion') {
          this.gameState = 'voting';
        } else if (this.gameState === 'voting' && this.selectedPlayer) {
          if (!this.eliminatePlayer(this.selectedPlayer)) return false;
        }
        this.draw();
        return true;
      }
    } else if (event.type === 'mousemove' && this.dragging) {
      const slider = this.sliders[this.dragging];
      const relativeX = mousePos.x - slider.rect.x;
      const ratio = Math.max(0, Math.min(1, relativeX / slider.rect.width));
      const rawValue = slider.min + ratio * (slider.max - slider.min);

      if (slider.snap) {
        slider.value = Math.round(rawValue);
      } else {
        slider.value = rawValue;
      }
      this.draw();
    } else if (event.type === 'mouseup') {
      for (const name in this.sliders) {
        this.sliders[name].dragging = false;
      }
      this.dragging = null;
    }

    return true;
  }

  eliminatePlayer(player: Player): boolean {
    player.alive = false;
    this.selectedPlayer = null;
    this.currentRound += 1;
    this.gameState = 'description';

    const civilians = this.players.filter(p => p.role === 'Civilian' && p.alive).length;
    const undercovers = this.players.filter(p => p.role === 'Undercover' && p.alive).length;
    const mrWhites = this.players.filter(p => p.role === 'Mr.White' && p.alive).length;

    if (undercovers === 0 && mrWhites === 0) {
      this.gameState = 'civilians_win';
      return false;
    }
    if (civilians <= 1 && mrWhites < 0) {
      this.gameState = 'undercovers_win';
      return false;
    }
    if (civilians <= 1 && mrWhites > 0) {
      this.gameState = 'mrwhite_win';
      return false;
    }
    if (this.players.filter(p => p.alive).length <= 2 && mrWhites > 0) {
      this.gameState = 'mrwhite_win';
      return false;
    }
    return true;
  }

  run(): void {
    const animate = () => {
      this.draw();
      requestAnimationFrame(animate);
    };
    animate();
    document.addEventListener('mousedown', (event) => this.handleEvents(event));
    document.addEventListener('click', (event) => this.handleEvents(event));
    document.addEventListener('mousemove', (event) => this.handleEvents(event));
    document.addEventListener('mouseup', (event) => this.handleEvents(event));
  }

  private getMousePos(event?: MouseEvent): { x: number, y: number } {
    const rect = this.gameComponent.gameCanvas.nativeElement.getBoundingClientRect();
    return event ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : { x: 0, y: 0 };
  }

  private isPointInRect(point: { x: number, y: number }, rect: { x: number, y: number, width: number, height: number }): boolean {
    return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
  }

  private getInstruction(): string {
    switch (this.gameState) {
      case 'description': return 'Describe your word without saying it directly!';
      case 'discussion': return 'Discuss who you think is the Undercover!';
      case 'voting': return 'Click on a player to vote them out';
      default: return '';
    }
  }

  private getText(font: string, text: string, color: string): CanvasImageSource {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.font = font;
    const width = tempCtx.measureText(text).width;
    const height = parseInt(font) || 32;
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.font = font;
    tempCtx.fillStyle = color;
    tempCtx.fillText(text, 0, height - 8);
    return tempCanvas;
  }
}