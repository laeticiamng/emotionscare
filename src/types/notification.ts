
import { ReactNode } from 'react';

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 'system' | 'emotion' | 'journal' | 'coach' | 'community' | 'achievement' | 'reminder' | 'success' | 'warning' | 'error' | 'all' | 'unread';

export type NotificationTone = 'standard' | 'subtle' | 'professional' | 'friendly';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: Date | string;
  timestamp?: Date | string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
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
  types?: Record<NotificationType, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationFilter {
  type?: string;
  types?: NotificationType[];
  read?: boolean;
  priority?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  toString(): string; // Add toString method to allow string comparisons
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
  onRead?: (id: string) => void; // Added for NotificationItem
}

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}
