import { User } from './user';

export interface Challenge {
    id: number;
    title: string;
    description: string;
    difficultyLevel: number;
    score_c: number;
    creatorId: number;
    opponentId: number;
  }