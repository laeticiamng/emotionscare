
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never' | 'immediate' | 'custom';
export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'invitation' | 'reminder' | 'info' | 'warning' | 'success' | 'error' | 'alert';
export type NotificationTone = 'neutral' | 'supportive' | 'professional' | 'friendly' | 'direct' | 'gentle' | 'motivational';
export type NotificationFilter = 'all' | 'unread' | NotificationType;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string | Date;
  read: boolean;
  userId?: string;
  action?: string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  priority?: number;
  category?: string;
  source?: string;
  createdAt?: string;
  body?: string;
  date?: string | Date;
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
  emailEnabled?: boolean;
  pushEnabled?: boolean;
}
