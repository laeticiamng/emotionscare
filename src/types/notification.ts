
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'system' | 'alert';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationFilter = 'all' | 'unread' | 'system' | 'alerts';
export type NotificationTone = 'formal' | 'friendly' | 'direct' | 'minimal';

export interface NotificationBadge {
  count: number;
  variant?: 'default' | 'destructive' | 'outline';
  className?: string;
}

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  priority?: NotificationPriority;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  category?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  email: boolean;
  push: boolean;
  categories?: {
    system: boolean;
    activity: boolean;
    social: boolean;
    marketing: boolean;
  };
  frequency: string;
}

export interface NotificationSettings {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  channels: NotificationChannels;
  frequency: NotificationFrequency;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
}
