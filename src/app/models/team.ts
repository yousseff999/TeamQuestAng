import { User } from './user';
import { Rank } from './rank';

export interface Team {
  id: number;
  name: string;
  creationDate: Date;
  score_t: number;
  members: User[];
  ranks: Rank[];
}