
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  description?: string;
  location?: string;
  type?: CalendarEventType;
  color?: string;
  user_id?: string;
  participants?: string[];
  recurrence?: RecurrenceRule;
}

export type CalendarEventType = 
  | 'meeting' 
  | 'session' 
  | 'reminder' 
  | 'personal' 
  | 'vr' 
  | 'coaching' 
  | 'challenge';

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  count?: number;
  until?: Date;
  byDay?: string[];
  byMonthDay?: number[];
  byMonth?: number[];
}

export interface CalendarSettings {
  showWeekends: boolean;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  workHoursStart: number;
  workHoursEnd: number;
  defaultView: 'day' | 'week' | 'month' | 'agenda';
  timeZone?: string;
}
