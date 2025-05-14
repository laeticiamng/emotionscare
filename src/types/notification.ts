
export enum NotificationFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  FLEXIBLE = "FLEXIBLE",
  NONE = "NONE"
}

export enum NotificationType {
  ALL = "ALL",
  SYSTEM = "SYSTEM",
  REMINDER = "REMINDER",
  COACH = "COACH"
}

export enum NotificationTone {
  MINIMALIST = "MINIMALIST",
  POETIC = "POETIC",
  DIRECTIVE = "DIRECTIVE",
  MOTIVATING = "MOTIVATING",
  GENTLE = "GENTLE"
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'system' | 'invitation' | 'reminder';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  linkTo?: string;
}

export interface EnhancedNotification extends Notification {
  read: boolean;
  timestamp: string;
}

export interface NotificationFilter {
  type: string;
  read?: boolean;
}

export interface NotificationPreference {
  frequency: NotificationFrequency;
  types: NotificationType[];
  tone: NotificationTone;
  enabled: boolean;
  quiet_hours: {
    start: string;
    end: string;
    enabled: boolean;
  };
}
