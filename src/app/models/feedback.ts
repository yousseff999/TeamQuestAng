import { Event } from './event';
import { User } from './user';

export interface Feedback {
  id: number;
  title: string;
  description: string;
  event: Event;
  user: User;
}