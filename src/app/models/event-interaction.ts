import { User } from './user';
import { Event } from './event';

export enum InteractionType {
    LIKE = 'LIKE',
    COMMENT = 'COMMENT',
    SHARE = 'SHARE',
    ATTEND = 'ATTEND'
  }

export interface EventInteraction {
  id: number;
  user: User;
  event: Event;
  interactionType: InteractionType;
  timestamp: Date;
}