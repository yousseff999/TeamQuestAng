import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as p5 from 'p5';
import * as Tone from 'tone';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-packman',
  templateUrl: './packman.component.html',
  styleUrls: ['./packman.component.css']
})
export class PackmanComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  
  private p5!: p5;
  private GRID_SIZE = 20;
  private TILE_SIZE = 30;
  private MAZE_WIDTH = 21;
  private MAZE_HEIGHT = 15;
  private PACMAN_SPEED = 3;
  private ENEMY_SPEED = 2;
  private pacman!: any;
  private enemies: any[] = [];
  private energyBalls: any[] = [];
  private score = 0;
  private highScore = 0;
  private gameOver = false;
  private maze!: number[][];
  private synth!: Tone.Synth;
  private eatSound!: Tone.Synth;
  private showScoreUpdateError = false; // Added for error display

  constructor(private userService: UserService) { } // Inject UserService

  ngOnInit(): void {
    this.createGame();
  }

  ngOnDestroy(): void {
    if (this.p5) {
      this.p5.remove();
    }
    Tone.Transport.stop();
  }

  private createGame(): void {
    const sketch = (s: any) => {
      s.setup = () => {
        const canvas = s.createCanvas(this.MAZE_WIDTH * this.TILE_SIZE, this.MAZE_HEIGHT * this.TILE_SIZE);
        canvas.parent('canvas-container');
        
        this.synth = new Tone.Synth().toDestination();
        this.eatSound = new Tone.Synth({ oscillator: { type: 'square' } }).toDestination();
        this.highScore = 0;
        this.resetGame();
      };

      s.draw = () => {
        s.background(20);
        
        // Flicker effect when enemies are close
        let flicker = false;
        for (let enemy of this.enemies) {
          if (s.dist(this.pacman.x, this.pacman.y, enemy.x, enemy.y) < this.TILE_SIZE * 2) {
            flicker = true;
            break;
          }
        }
        if (flicker) {
          s.background(50, 0, 0, 50 + 50 * s.sin(s.frameCount * 0.2));
        }

        // Draw maze
        for (let y = 0; y < this.MAZE_HEIGHT; y++) {
          for (let x = 0; x < this.MAZE_WIDTH; x++) {
            if (this.maze[y][x] === 1) {
              s.fill(0, 100, 255);
              s.noStroke();
              s.rect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
            }
          }
        }

        if (!this.gameOver) {
          // Update and draw Pac-Man
          this.pacman.update(s);
          this.pacman.draw(s);

          // Update and draw enemies
          for (let enemy of this.enemies) {
            enemy.update(s, this.pacman, this);
            enemy.draw(s);
            if (s.dist(this.pacman.x, this.pacman.y, enemy.x, enemy.y) < (this.pacman.size + enemy.size) / 2) {
              this.gameOver = true;
              Tone.Transport.stop();
              this.showGameOver();
              this.updateUserScore(); // Call to update user score when game ends
            }
          }

          // Draw and check energy balls
          for (let i = this.energyBalls.length - 1; i >= 0; i--) {
            let ball = this.energyBalls[i];
            s.fill(0, 255, 0, 150 + 100 * s.sin(s.frameCount * 0.15));
            s.noStroke();
            s.ellipse(ball.x, ball.y, this.TILE_SIZE / 4);
            if (s.dist(this.pacman.x, this.pacman.y, ball.x, ball.y) < this.pacman.size / 2) {
              this.energyBalls.splice(i, 1);
              this.score++;
              this.eatSound.triggerAttackRelease("G4", "16n");
              document.getElementById('score-display')!.innerText = `Score: ${this.score}`;
              if (this.score > this.highScore) {
                this.highScore = this.score;
                document.getElementById('high-score-display')!.innerText = `High Score: ${this.highScore}`;
              }
              let newX, newY;
              do {
                newX = s.floor(s.random(1, this.MAZE_WIDTH - 1));
                newY = s.floor(s.random(1, this.MAZE_HEIGHT - 1));
              } while (this.maze[newY][newX] === 1);
              this.energyBalls.push({ 
                x: newX * this.TILE_SIZE + this.TILE_SIZE / 2, 
                y: newY * this.TILE_SIZE + this.TILE_SIZE / 2 
              });
            }
          }
        }

        // Draw score update error if needed
        if (this.showScoreUpdateError) {
          s.fill(255, 0, 0);
          s.textSize(16);
          s.textAlign(s.CENTER);
          s.text("Error updating score", s.width/2, 30);
        }
      };

      s.keyPressed = () => {
        // Prevent arrow keys from scrolling the page
        if ([s.LEFT_ARROW, s.RIGHT_ARROW, s.UP_ARROW, s.DOWN_ARROW].includes(s.keyCode)) {
          return false;
        }
        return true;
      };
    };

    this.p5 = new p5(sketch);
    
    // Add restart button event listener
    document.getElementById('restart-button')?.addEventListener('click', () => {
      this.resetGame();
    });
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
          setTimeout(() => this.showScoreUpdateError = false, 3000);
          if (this.p5) {
            this.p5.redraw();
          }
        }
      });
    }
  }

  private resetGame(): void {
    this.score = 0;
    this.gameOver = false;
    document.getElementById('score-display')!.innerText = `Score: ${this.score}`;
    document.getElementById('game-over-screen')!.style.display = 'none';
    this.maze = this.generateMaze();
    this.pacman = new PacMan(this.MAZE_WIDTH, this.MAZE_HEIGHT, this.TILE_SIZE, this.maze);
    this.enemies = [
      new Enemy(1, 1, this.TILE_SIZE, [255, 0, 0], this.maze),
      new Enemy(19, 1, this.TILE_SIZE, [255, 105, 180], this.maze),
      new Enemy(1, 13, this.TILE_SIZE, [0, 255, 255], this.maze)
    ];
    this.energyBalls = this.placeEnergyBalls();
    Tone.Transport.start();
    this.playBackgroundPulse();
  }

  private showGameOver(): void {
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'block';
      document.getElementById('final-score')!.innerText = `Final Score: ${this.score}`;
    }
  }

  private generateMaze(): number[][] {
    let maze = Array(this.MAZE_HEIGHT).fill(0).map(() => Array(this.MAZE_WIDTH).fill(1));
    
    const carve = (x: number, y: number) => {
      maze[y][x] = 0;
      let directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
      directions.sort(() => Math.random() - 0.5);
      for (let [dx, dy] of directions) {
        let nx = x + dx, ny = y + dy;
        if (nx > 0 && nx < this.MAZE_WIDTH - 1 && ny > 0 && ny < this.MAZE_HEIGHT - 1 && maze[ny][nx] === 1) {
          maze[y + dy / 2][x + dx / 2] = 0;
          carve(nx, ny);
        }
      }
    };
    
    carve(1, 1);
    maze[7][10] = 0; // Ensure Pac-Man start position
    return maze;
  }

  private placeEnergyBalls(): any[] {
    let balls = [];
    for (let y = 1; y < this.MAZE_HEIGHT - 1; y++) {
      for (let x = 1; x < this.MAZE_WIDTH - 1; x++) {
        if (this.maze[y][x] === 0 && !(x === 10 && y === 7)) {
          if (Math.random() < 0.3) {
            balls.push({ 
              x: x * this.TILE_SIZE + this.TILE_SIZE / 2, 
              y: y * this.TILE_SIZE + this.TILE_SIZE / 2 
            });
          }
        }
      }
    }
    return balls;
  }

  private playBackgroundPulse(): void {
    const loop = new Tone.Loop((time: number) => {
      this.synth.triggerAttackRelease("C2", "8n", time);
    }, "2n").start(0);
  }

  private isWall(x: number, y: number): boolean {
    if (x < 0 || x >= this.MAZE_WIDTH || y < 0 || y >= this.MAZE_HEIGHT) return true;
    return this.maze[y][x] === 1;
  }

  public findPath(startX: number, startY: number, goalX: number, goalY: number): [number, number][] {
    let queue: [number, number][] = [[startX, startY]];
    let visited = new Set<string>([`${startX},${startY}`]);
    let parent: { [key: string]: [number, number] | null } = { [`${startX},${startY}`]: null };
    let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (queue.length) {
      let [x, y] = queue.shift()!;
      if (x === goalX && y === goalY) {
        let path: [number, number][] = [];
        let current: [number, number] | null = [x, y];
        while (current) {
          path.unshift(current);
          current = parent[`${current[0]},${current[1]}`];
        }
        return path;
      }
      for (let [dx, dy] of directions) {
        let nx = x + dx, ny = y + dy;
        if (!this.isWall(nx, ny)) {
          const key = `${nx},${ny}`;
          if (!visited.has(key)) {
            queue.push([nx, ny]);
            visited.add(key);
            parent[key] = [x, y];
          }
        }
      }
    }
    return [];
  }
}

// PacMan and Enemy classes remain unchanged
class PacMan {
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  targetGridX: number;
  targetGridY: number;
  size: number;
  angle: number;
  moving: boolean;
  private maze: number[][];

  constructor(mazeWidth: number, mazeHeight: number, tileSize: number, maze: number[][]) {
    this.gridX = 10;
    this.gridY = 7;
    this.x = this.gridX * tileSize + tileSize / 2;
    this.y = this.gridY * tileSize + tileSize / 2;
    this.targetGridX = this.gridX;
    this.targetGridY = this.gridY;
    this.size = tileSize * 0.8;
    this.angle = 0;
    this.moving = false;
    this.maze = maze;
  }

  update(p: any): void {
    if (!this.moving) {
      let nextGridX = this.gridX;
      let nextGridY = this.gridY;
      if (p.keyIsDown(p.LEFT_ARROW) && !this.isWall(this.gridX - 1, this.gridY)) {
        nextGridX--;
        this.angle = p.PI;
      } else if (p.keyIsDown(p.RIGHT_ARROW) && !this.isWall(this.gridX + 1, this.gridY)) {
        nextGridX++;
        this.angle = 0;
      } else if (p.keyIsDown(p.UP_ARROW) && !this.isWall(this.gridX, this.gridY - 1)) {
        nextGridY--;
        this.angle = -p.HALF_PI;
      } else if (p.keyIsDown(p.DOWN_ARROW) && !this.isWall(this.gridX, this.gridY + 1)) {
        nextGridY++;
        this.angle = p.HALF_PI;
      }
      if (nextGridX !== this.gridX || nextGridY !== this.gridY) {
        this.targetGridX = nextGridX;
        this.targetGridY = nextGridY;
        this.moving = true;
      }
    }

    if (this.moving) {
      const tileSize = this.size / 0.8; // Calculate tileSize from size
      const targetX = this.targetGridX * tileSize + tileSize / 2;
      const targetY = this.targetGridY * tileSize + tileSize / 2;
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = this.size / (tileSize * 0.8) * 3; // Adjust speed based on size
      
      if (dist < speed) {
        this.x = targetX;
        this.y = targetY;
        this.gridX = this.targetGridX;
        this.gridY = this.targetGridY;
        this.moving = false;
      } else {
        this.x += (dx / dist) * speed;
        this.y += (dy / dist) * speed;
      }
    }
  }

  draw(p: any): void {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.angle);
    p.fill(255, 255, 0);
    p.noStroke();
    p.arc(0, 0, this.size, this.size, p.sin(p.frameCount * 0.1) * p.PI / 4, p.TWO_PI - p.sin(p.frameCount * 0.1) * p.PI / 4);
    p.fill(255, 255, 100, 50);
    p.ellipse(0, 0, this.size * 1.2); // Glow
    p.pop();
  }

  private isWall(x: number, y: number): boolean {
    if (x < 0 || x >= this.maze[0].length || y < 0 || y >= this.maze.length) return true;
    return this.maze[y][x] === 1;
  }
}

class Enemy {
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  targetGridX: number;
  targetGridY: number;
  color: number[];
  size: number;
  moving: boolean;
  private maze: number[][];
  private path: [number, number][] = [];

  constructor(gridX: number, gridY: number, tileSize: number, color: number[], maze: number[][]) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = this.gridX * tileSize + tileSize / 2;
    this.y = this.gridY * tileSize + tileSize / 2;
    this.targetGridX = gridX;
    this.targetGridY = gridY;
    this.color = color;
    this.size = tileSize * 0.8;
    this.moving = false;
    this.maze = maze;
  }

  update(p: any, pacman: PacMan, component: PackmanComponent): void {
    if (!this.moving) {
      // Calculate path to Pac-Man
      this.path = component.findPath(this.gridX, this.gridY, pacman.gridX, pacman.gridY);
      if (this.path.length > 1) {
        this.targetGridX = this.path[1][0]; // Move to the next point in the path
        this.targetGridY = this.path[1][1];
        this.moving = true;
      }
    }

    if (this.moving) {
      const tileSize = this.size / 0.8; // Calculate tileSize from size
      const targetX = this.targetGridX * tileSize + tileSize / 2;
      const targetY = this.targetGridY * tileSize + tileSize / 2;
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = this.size / (tileSize * 0.8) * 2; // Adjust speed based on size
      
      if (dist < speed) {
        this.x = targetX;
        this.y = targetY;
        this.gridX = this.targetGridX;
        this.gridY = this.targetGridY;
        this.moving = false;
      } else {
        this.x += (dx / dist) * speed;
        this.y += (dy / dist) * speed;
      }
    }
  }

  draw(p: any): void {
    p.push();
    p.translate(this.x, this.y + p.sin(p.frameCount * 0.1) * 5); // Wavy motion
    p.fill(this.color[0], this.color[1], this.color[2]);
    p.noStroke();
    p.arc(0, 0, this.size, this.size, p.PI, p.TWO_PI);
    p.rectMode(p.CENTER);
    p.rect(0, this.size / 4, this.size, this.size / 2);
    p.fill(255);
    p.ellipse(-this.size / 4, -this.size / 4, this.size / 5);
    p.ellipse(this.size / 4, -this.size / 4, this.size / 5); // Animated eyes
    p.pop();
  }

  private isWall(x: number, y: number): boolean {
    if (x < 0 || x >= this.maze[0].length || y < 0 || y >= this.maze.length) return true;
    return this.maze[y][x] === 1;
  }
}