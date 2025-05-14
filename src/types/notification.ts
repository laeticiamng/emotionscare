
export type NotificationFrequency = 'instant' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'all' | 'important' | 'mentions' | 'none';
export type NotificationTone = 'gentle' | 'neutral' | 'assertive' | 'silent' | 'custom';

// Adding enums for use in components referencing them
export enum NotificationFrequencyEnum {
  INSTANT = 'instant',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  NEVER = 'never'
}

export enum NotificationTypeEnum {
  ALL = 'all',
  IMPORTANT = 'important',
  MENTIONS = 'mentions',
  NONE = 'none'
}

export enum NotificationToneEnum {
  GENTLE = 'gentle',
  NEUTRAL = 'neutral',
  ASSERTIVE = 'assertive',
  SILENT = 'silent',
  CUSTOM = 'custom'
}

export interface NotificationPreference {
  id?: string;
  type: string;
  frequency: NotificationFrequency;
  channels?: string[];
  user_id?: string;
  tone?: NotificationTone;
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
  timestamp?: string;
  createdAt?: string;
  link?: string;
  action?: string;
  source?: string;
}
