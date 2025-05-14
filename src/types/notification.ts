
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never';

export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community';

export type NotificationTone = 'neutral' | 'supportive' | 'professional' | 'friendly';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  userId?: string;
  action?: string;
  icon?: string;
  priority?: number;
  category?: string;
  source?: string;
  createdAt?: string;
  body?: string;
}

export interface NotificationBadge {
  count: number;
  active: boolean;
  badgesCount?: number;
  notificationsCount?: number;
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}
