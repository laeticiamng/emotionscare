
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never' | 'realtime' | 'custom';
export type NotificationType = 'all' | 'important' | 'none' | 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'info' | 'warning' | 'error' | 'success' | 'reminder';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm' | 'supportive' | 'gentle';
export type NotificationPriority = 'high' | 'medium' | 'low' | 'urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  createdAt?: string | Date;
  date?: string;
  timestamp?: string | Date; // For compatibility
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  image?: string;
  user_id?: string;
  body?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  emailEnabled: boolean;
  pushEnabled: boolean;
  soundEnabled?: boolean;
  enabled: boolean;
  channels?: NotificationChannels;
  inAppEnabled?: boolean;
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
  hasNew?: boolean;
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
