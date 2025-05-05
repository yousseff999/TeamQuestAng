import { Feedback } from './feedback';
import { User } from './user';
import { Activity } from './activity';

export enum TypeEvent {
    SPORTS = 'SPORTS',
    CULTURAL = 'CULTURAL',
    CAMPING = 'CAMPING',
    PARTY = 'PARTY'
  }

export interface Event {
  target: HTMLInputElement;
  eventId: number;
  eventName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  eventImage: string;
  eventType: TypeEvent;
  feedbacks: Feedback[];
  participants: User[];
  activities: Activity[];
  users?: User[];
}