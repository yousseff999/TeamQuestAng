import { User } from './user';
import { Team } from './team';
import { Department } from './department';

export enum RankType {
    USER = 'USER',
    TEAM = 'TEAM',
    DEPARTMENT = 'DEPARTMENT'
  }
  
export interface Rank {
  id: number;
  date: Date;
  rankType: RankType;
  score: number;
  user?: User;
  team?: Team;
  department?: Department;
}