import { User } from './user';
import { Rank } from './rank';

export interface Department {
  id: number;
  name: string;
  score_d: number;
  floor: number;
  users: User[];
  ranks: Rank[];
}