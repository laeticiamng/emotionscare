
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'emotion' | 'recommendation' | 'team' | 'goal' | 'coach' | 'system';
export type NotificationTone = 'positive' | 'neutral' | 'urgent' | 'informational';

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sms?: boolean;
}

export interface NotificationPreference extends NotificationChannels {
  type: NotificationType;
  enabled?: boolean;
  emailEnabled?: boolean;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  tone?: NotificationTone;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  image?: string;
  sender?: string;
}

export interface NotificationFilter {
  type?: NotificationType;
  read?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}
