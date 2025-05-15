
import { ReactNode } from 'react';

/**
 * Notification frequencies
 */
export type NotificationFrequency = 'immediately' | 'daily' | 'weekly' | 'never';

/**
 * Types of notifications
 */
export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'session' 
  | 'achievement' 
  | 'reminder'
  | 'message'
  | 'update'
  | 'alert'
  | 'info';

/**
 * Notification tone options
 */
export type NotificationTone = 'professional' | 'friendly' | 'supportive' | 'minimal';

/**
 * Notification priorities
 */
export type NotificationPriority = 'high' | 'medium' | 'low';

/**
 * Notification channels configuration
 */
export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

/**
 * Filter options for notifications
 */
export interface NotificationFilter {
  type?: NotificationType[];
  read?: boolean;
  timeRange?: 'today' | 'week' | 'month' | 'all';
  priority?: NotificationPriority[];
}

/**
 * Interface for badge component
 */
export interface NotificationBadge {
  count: number;
  max?: number;
  variant?: 'default' | 'dot';
}

/**
 * Notification preference settings
 */
export interface NotificationPreference {
  type: NotificationType;
  channels: NotificationChannels;
  frequency: NotificationFrequency;
  enabled?: boolean;
}

/**
 * Props for notification item component
 */
export interface NotificationItemProps {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  timestamp: string | Date;
  read: boolean;
  priority?: NotificationPriority;
  onClick?: () => void;
  onMarkAsRead?: (id: string) => void;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Basic notification interface
 */
export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  timestamp: string | Date;
  read: boolean;
  priority?: NotificationPriority;
  user_id?: string;
  action?: {
    label: string;
    url?: string;
    type?: string;
  };
  metadata?: Record<string, any>;
}
