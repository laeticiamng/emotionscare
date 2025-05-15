
// Types liés aux notifications
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'alert' | 'reminder';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'casual';
export type NotificationFilter = 'all' | 'unread' | 'alerts' | 'system';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  read?: boolean;
  timestamp?: Date | string;
  actionUrl?: string;
  actionLabel?: string;
  priority?: NotificationPriority;
  category?: string;
}

export interface NotificationBadge {
  count: number;
  onDismiss?: () => void;
  variant?: 'primary' | 'danger' | 'success' | 'warning';
  size?: 'default' | 'large' | 'small';
}

export interface NotificationPreference {
  type: NotificationType | string;
  types?: string[];
  enabled: boolean;
  frequency?: NotificationFrequency;
  channels?: string[];
  tone?: NotificationTone;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  className?: string;
}
