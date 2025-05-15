
export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  timestamp: Date | string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  sender_id?: string;
  recipient_id?: string;
  priority?: NotificationPriority;
  user_id?: string;
  created_at?: string;
  createdAt?: string;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'reminder' | 'system' | 'emotion' | 'challenge' | 'achievement';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never' | 'realtime';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm' | 'supportive' | 'casual' | 'minimal';
export type NotificationFilter = 'all' | 'unread' | 'alerts' | 'system';

export interface NotificationBadge {
  count: number;
  type?: NotificationType;
  animate?: boolean;
}

export interface NotificationPreference {
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
  frequency?: NotificationFrequency;
  type?: string;
  tone?: NotificationTone;
  channels?: {
    email: boolean;
    push: boolean;
    inApp?: boolean;
  };
  types?: string[];
}

export interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  showActions?: boolean;
}
