
export enum NotificationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  FLEXIBLE = 'flexible',
  NONE = 'none'
}

export enum NotificationType {
  ALL = 'all',
  IMPORTANT = 'important',
  ACTIVITY = 'activity',
  REMINDERS = 'reminders',
  MESSAGES = 'messages'
}

export enum NotificationTone {
  MINIMALIST = 'minimalist',
  POETIC = 'poetic',
  DIRECTIVE = 'directive',
  MOTIVATING = 'motivating',
  GENTLE = 'gentle'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date | string;
  linkTo?: string;
}

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  frequency?: NotificationFrequency;
  time?: string;
  channels?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
