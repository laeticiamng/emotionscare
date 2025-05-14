
export type NotificationFrequency = 'instant' | 'hourly' | 'daily' | 'weekly';
export type NotificationType = 'system' | 'emotion' | 'reminder' | 'achievement' | 'journal';
export type NotificationTone = 'neutral' | 'friendly' | 'professional' | 'encouraging';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read?: boolean;
  important?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  timestamp?: string;
  createdAt?: string;
  date?: Date | string;
  image?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  frequency: NotificationFrequency;
  types: Record<NotificationType, boolean>;
  tone: NotificationTone;
}
