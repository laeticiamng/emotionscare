
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly' | 'never';
export type NotificationType = 'alert' | 'info' | 'success' | 'warning' | 'error';
export type NotificationTone = 'positive' | 'negative' | 'neutral';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  content?: string;
  type?: NotificationType;
  read?: boolean;
  createdAt?: string;
  timestamp?: string;
  user_id?: string;
  action_url?: string;
  action_text?: string;
  icon?: string;
  priority?: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  channel: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency: NotificationFrequency;
}
