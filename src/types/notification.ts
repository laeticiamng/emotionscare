
export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'informational' | 'success' | 'warning' | 'error';

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: string;
  types?: {
    [key: string]: boolean;
  };
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  timestamp: Date | string;
  read: boolean;
  userId?: string;
  link?: string;
  icon?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  actions?: NotificationAction[];
}

export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'achievement';

export interface NotificationAction {
  label: string;
  action: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface NotificationFilter {
  type?: NotificationType | 'all';
  read?: boolean;
  date?: 'today' | 'week' | 'month' | 'all';
  priority?: 'low' | 'normal' | 'high' | 'urgent' | 'all';
}
