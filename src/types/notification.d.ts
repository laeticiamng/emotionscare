
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'custom';
export type NotificationType = 'all' | 'emotion' | 'journal' | 'coach' | 'vr' | 'community' | 'system';
export type NotificationTone = 'supportive' | 'direct' | 'gentle' | 'motivational';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: string;
  actionUrl?: string;
  actionLabel?: string;
  image?: string;
  icon?: string;
  user_id?: string;
  body?: string;
  createdAt?: string;
  timestamp?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  emailEnabled: boolean;
  pushEnabled: boolean;
  soundEnabled?: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface NotificationBadge {
  count: number;
  hasNew: boolean;
  lastSeen?: string;
  badgesCount?: number;
  notificationsCount?: number;
}
