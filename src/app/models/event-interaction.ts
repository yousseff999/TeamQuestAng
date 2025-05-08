import { User } from './user';
import { Event } from './event';

export enum InteractionType {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
    INTERRESTED = 'INTERRESTED'
  }

export interface EventInteraction {
  id: number;
  user: User;
  event: Event;
  interactionType: InteractionType;
  timestamp: Date;
}