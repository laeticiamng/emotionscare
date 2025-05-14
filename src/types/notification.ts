
export type NotificationType = 'all' | 'important' | 'minimal';
export type NotificationFrequency = 'real-time' | 'hourly' | 'daily' | 'weekly';
export type NotificationTone = 'friendly' | 'professional' | 'minimalist';

export interface NotificationPreference {
  type: NotificationType;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: string;
  read?: boolean;
  timestamp?: string;
  createdAt?: string;
  date?: string;
}
