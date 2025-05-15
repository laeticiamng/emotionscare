
import { ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  timestamp: string | Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  sender_id?: string;
  recipient_id?: string;
  priority?: NotificationPriority;
  user_id?: string;
  created_at?: string;
  createdAt?: string;
  action?: ReactNode;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'reminder' | 'system' | 'emotion' | 'challenge' | 'achievement';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  frequency: NotificationFrequency;
  doNotDisturb: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
}

export type NotificationFrequency = 'realtime' | 'immediate' | 'daily' | 'weekly' | 'never';

export interface NotificationTone {
  sound: 'default' | 'subtle' | 'loud' | 'mute' | string;
  vibration: boolean;
  led: boolean;
}

export interface NotificationPreference {
  id?: string;
  type?: string;
  frequency: NotificationFrequency;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  channels?: NotificationChannels | string[];
  priority?: NotificationPriority;
  tone?: NotificationTone | string;
}

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sms?: boolean;
}

export interface NotificationFilter {
  type?: NotificationType | 'all';
  read?: boolean;
  startDate?: string;
  endDate?: string;
}

export type NotificationBadge = {
  count: number;
  type?: NotificationType;
};

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAction?: (notification: Notification) => void;
  showActions?: boolean;
  compact?: boolean;
}
