
export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'emotion' | 'journal' | 'coach' | 'system' | 'achievement';
export type NotificationTone = 'gentle' | 'neutral' | 'assertive' | 'cheerful' | 'minimal';

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
};

export const NotificationType = {
  EMOTION: 'emotion' as NotificationType,
  JOURNAL: 'journal' as NotificationType,
  COACH: 'coach' as NotificationType,
  SYSTEM: 'system' as NotificationType,
  ACHIEVEMENT: 'achievement' as NotificationType,
};

export const NotificationTone = {
  GENTLE: 'gentle' as NotificationTone,
  NEUTRAL: 'neutral' as NotificationTone,
  ASSERTIVE: 'assertive' as NotificationTone,
  CHEERFUL: 'cheerful' as NotificationTone,
  MINIMAL: 'minimal' as NotificationTone,
};

