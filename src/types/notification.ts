
export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never' | 'flexible' | 'none';
export type NotificationType = 'emotion' | 'journal' | 'coach' | 'system' | 'achievement' | 'all' | 'success' | 'warning' | 'info' | 'error' | 'reminder' | 'invitation';
export type NotificationTone = 'gentle' | 'neutral' | 'assertive' | 'cheerful' | 'minimal' | 'minimalist' | 'poetic' | 'directive' | 'motivating';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  timestamp?: string;
}

export interface EnhancedNotification extends Notification {
  priority: number;
  category: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  date?: string;
  isRead?: boolean;
  linkTo?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  tone: NotificationTone;
}

export const NotificationFrequency = {
  IMMEDIATE: 'immediate' as NotificationFrequency,
  HOURLY: 'hourly' as NotificationFrequency,
  DAILY: 'daily' as NotificationFrequency,
  WEEKLY: 'weekly' as NotificationFrequency,
  NEVER: 'never' as NotificationFrequency,
  FLEXIBLE: 'flexible' as NotificationFrequency,
  NONE: 'none' as NotificationFrequency
};

export const NotificationType = {
  EMOTION: 'emotion' as NotificationType,
  JOURNAL: 'journal' as NotificationType,
  COACH: 'coach' as NotificationType,
  SYSTEM: 'system' as NotificationType,
  ACHIEVEMENT: 'achievement' as NotificationType,
  SUCCESS: 'success' as NotificationType,
  WARNING: 'warning' as NotificationType,
  INFO: 'info' as NotificationType,
  ERROR: 'error' as NotificationType,
  REMINDER: 'reminder' as NotificationType,
  INVITATION: 'invitation' as NotificationType,
  ALL: 'all' as NotificationType
};

export const NotificationTone = {
  GENTLE: 'gentle' as NotificationTone,
  NEUTRAL: 'neutral' as NotificationTone,
  ASSERTIVE: 'assertive' as NotificationTone,
  CHEERFUL: 'cheerful' as NotificationTone,
  MINIMAL: 'minimal' as NotificationTone,
  MINIMALIST: 'minimalist' as NotificationTone,
  POETIC: 'poetic' as NotificationTone,
  DIRECTIVE: 'directive' as NotificationTone,
  MOTIVATING: 'motivating' as NotificationTone
};
