
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system' | 'user' | 'emotion' | string;
export type NotificationPriority = 'high' | 'medium' | 'low';
export type NotificationFrequency = 'immediately' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'professional' | 'friendly' | 'direct';

export interface NotificationPreference {
  id?: string;
  user_id?: string;
  enabled?: boolean;
  type?: NotificationType | string;
  types?: NotificationType[];
  channels?: { email: boolean; push: boolean; inApp: boolean } | string[];
  frequency?: NotificationFrequency;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  tone?: NotificationTone;
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
}

export interface NotificationFilter {
  type?: NotificationType | 'all';
  read?: boolean | 'all';
  priority?: NotificationPriority | 'all';
  dateFrom?: Date | string;
  dateTo?: Date | string;
}

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
