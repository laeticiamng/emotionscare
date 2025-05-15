
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'all' | 'important' | 'none' | 'system' | 'emotion' | 'coach' | 'journal' | 'community';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  createdAt: string | Date;
  actionUrl?: string;
  icon?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  frequency?: NotificationFrequency;
  types?: Record<NotificationType, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationFilter {
  type?: NotificationType | 'all';
  read?: boolean;
  priority?: NotificationPriority | 'all';
  date?: 'today' | 'week' | 'month' | 'all';
}

export interface NotificationBadge {
  count: number;
  variant?: 'default' | 'important';
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  channels: NotificationChannels;
  frequency: NotificationFrequency;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
