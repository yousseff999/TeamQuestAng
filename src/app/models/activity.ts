import { User } from './user';
import { Event } from './event';

export interface Activity {
    activityID: number;
    activityName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    currentParticipants: number;
    activityImage: string;
    maxParticipants: number;
    status: string;
    event: Event;
    users: User[];
  }