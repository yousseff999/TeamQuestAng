import { Event } from './event';
import { Team } from './team';
import { Rank } from './rank';
import { Department } from './department';
import { Activity } from './activity';

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    TEAMLEAD = 'TEAMLEAD'
    
  }

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  score_u: number;
  createdAt: Date;
  resetToken?: string;
  tokenExpirationTime?: Date;
  role: Role;
  events: Event[];
  team?: Team;
  ranks: Rank[];
  department?: Department;
  activities: Activity[];
}