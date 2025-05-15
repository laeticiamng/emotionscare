
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system' | 'user' | 'emotion' | 'coach' | 'journal' | 'community' | 'vr' | 'reminder' | string;
export type NotificationPriority = 'high' | 'medium' | 'low';
export type NotificationFrequency = 'immediately' | 'daily' | 'weekly' | 'never' | 'immediate' | 'realtime' | 'custom';
export type NotificationTone = 'professional' | 'friendly' | 'direct' | 'supportive' | 'minimal' | 'casual';

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationPreference {
  id?: string;
  user_id?: string;
  enabled?: boolean;
  type?: NotificationType | string;
  types?: NotificationType[];
  channels?: NotificationChannels | string[];
  frequency?: NotificationFrequency;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  tone?: NotificationTone;
  soundEnabled?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  timestamp: string | Date;
  read?: boolean;
  userId?: string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  body?: string;
  createdAt?: string;
  date?: string;
  user_id?: string;
}

export type NotificationFilter = 'all' | 'unread' | 'alerts' | string;

export interface NotificationBadge {
  count: number;
  type?: NotificationType;
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAction?: (notification: Notification) => void;
}
