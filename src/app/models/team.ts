import { User } from './user';
import { Rank } from './rank';
import { Submission } from './Submission';

export interface Team {
  id: number;
  name: string;
  description: string;
  creationDate: Date;
  score_t: number;
  members: User[];
  ranks: Rank[];
  submissions?: Submission[];
}