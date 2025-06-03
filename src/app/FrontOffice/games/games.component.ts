import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: string;
  players: string;
  estimatedTime: string;
  color: string;
  category: string;
  path: string;
}

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  hoveredGame: string | null = null;
  selectedCategory: string = 'all';

  games: Game[] = [
    {
      id: 'memory-game',
      name: 'Memory Challenge',
      description: 'Test your memory skills with this classic card matching game',
      icon: '🧠',
      difficulty: 'Medium',
      players: '1 Player',
      estimatedTime: '5-10 min',
      color: 'purple',
      category: 'puzzle',
      path: '/memory-game'
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Challenge yourself with general knowledge questions',
      icon: '❓',
      difficulty: 'Easy',
      players: '1+ Players',
      estimatedTime: '10-15 min',
      color: 'blue',
      category: 'trivia',
      path: '/puzzle-game'
    },
    {
      id: 'packman-game',
      name: 'Pac-Adventure',
      description: 'Classic arcade action with a modern twist',
      icon: '🎮',
      difficulty: 'Hard',
      players: '1 Player',
      estimatedTime: '15-30 min',
      color: 'yellow',
      category: 'arcade',
      path: '/packman-game'
    },
    {
      id: 'roulette-game',
      name: 'Lucky Roulette',
      description: 'Spin the wheel and test your luck',
      icon: '🎰',
      difficulty: 'Easy',
      players: '1+ Players',
      estimatedTime: '5-20 min',
      color: 'red',
      category: 'casino',
      path: '/roulette-game'
    },
    {
      id: 'mr-white-game',
      name: 'Mr. White Mystery',
      description: 'Solve mysteries and uncover hidden secrets',
      icon: '🕵️',
      difficulty: 'Hard',
      players: '2+ Players',
      estimatedTime: '20-45 min',
      color: 'gray',
      category: 'mystery',
      path: '/undercover-game'
    },
    {
      id: 'snake-game',
      name: 'Snake Adventure',
      description: 'Guide the snake to eat food and grow while avoiding walls and yourself',
      icon: '🐍',
      difficulty: 'Medium',
      players: '1 Player',
      estimatedTime: '5-15 min',
      color: 'green',
      category: 'arcade',
      path: '/snake-game'
    }
  ];

  categories = [
    { id: 'all', name: 'All Games', icon: '🎯' },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
    { id: 'trivia', name: 'Trivia', icon: '📚' },
    { id: 'arcade', name: 'Arcade', icon: '🕹️' },
    { id: 'casino', name: 'Casino', icon: '🎲' },
    { id: 'mystery', name: 'Mystery', icon: '🔍' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onGameHover(gameId: string | null): void {
    this.hoveredGame = gameId;
  }

  onGameClick(gameId: string): void {
    console.log(`Starting game: ${gameId}`);
    const game = this.games.find(g => g.id === gameId);
    if (game) {
      this.router.navigate([game.path]);
    }
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  get filteredGames(): Game[] {
    if (this.selectedCategory === 'all') {
      return this.games;
    }
    return this.games.filter(game => game.category === this.selectedCategory);
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return 'difficulty-medium';
    }
  }

  getGameColorClass(color: string): string {
    return `game-${color}`;
  }
}
