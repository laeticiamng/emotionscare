
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'all' | 'system' | 'emotion' | 'journal' | 'coach' | 'community' | 'achievement' | 'important' | 'reminder' | 'success' | 'warning' | 'error' | 'none' | 'info';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm' | 'supportive' | 'casual' | 'minimal' | 'gentle' | 'standard' | 'subtle' | string;
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationChannels = {
  email: boolean;
  push: boolean;
  inApp: boolean;
};

export type NotificationFilter = 'all' | 'unread' | 'system' | 'emotion' | 'journal' | 'coach' | 'community' | 'achievement' | string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  read: boolean;
  timestamp?: string | Date;
  date?: string | Date;
  actionUrl?: string;
  actionLabel?: string;
  channel?: 'email' | 'push' | 'in-app';
  userId?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  channels?: NotificationChannels;
  frequency?: NotificationFrequency;
  types?: Record<string, boolean>;
  type?: string; // Added for backward compatibility
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  tone?: NotificationTone;
  soundEnabled?: boolean;
}

export interface NotificationPreference extends NotificationPreferences {}

export interface NotificationBadge {
  unread: number;
}

export interface NotificationSettings {
  enabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: Record<string, boolean>;
  frequency: NotificationFrequency;
  tone: NotificationTone;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
  onRead?: (id: string) => void;
}
