
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationTone = 'professional' | 'friendly' | 'supportive' | 'direct';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  userId?: string;
  linkTo?: string;
  priority?: 'low' | 'medium' | 'high';
  image?: string;
}

export interface NotificationPreference {
  type: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
}

export type NotificationFilter = 'all' | 'unread' | 'read';
