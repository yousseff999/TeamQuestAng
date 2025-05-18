// src/app/models/submission.ts
import { Team } from './team';
import { Defi } from './defi';

export interface Submission {
  id: number; 
  content: string;
  submittedAt: string; 
  team?: Team;
  scoreInput?: number;
  
}
