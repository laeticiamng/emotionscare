
// Types liés aux notifications
export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'reminder' | 'alert';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm';
export type NotificationFilter = 'all' | 'unread' | 'system' | 'alerts';

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
}

export interface NotificationBadge {
  count: number;
  variant?: 'default' | 'destructive' | 'outline';
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => Promise<void> | void;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  types?: Record<string, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
