
import { ReactNode } from 'react';

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 
  | 'system' | 'emotion' | 'journal' | 'coach' | 'community' | 'achievement' 
  | 'reminder' | 'success' | 'warning' | 'error' | 'all' | 'unread' | 'important' | 'none';

export type NotificationTone = 
  | 'standard' | 'subtle' | 'professional' | 'friendly' 
  | 'motivational' | 'direct' | 'calm';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date?: Date | string;
  timestamp?: Date | string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: ReactNode;
  priority?: NotificationPriority;
  sender_id?: string;
  recipient_id?: string;
  channel?: 'email' | 'push' | 'in-app';
  userId?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency?: NotificationFrequency;
  types?: Record<NotificationType | string, boolean>;
  type?: string | NotificationType;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  tone?: NotificationTone;
}

export type NotificationFilter = 'all' | 'unread' | 'system' | 'emotion' | 'journal' | 'coach' | 'community' | 'achievement' | string;

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

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}
