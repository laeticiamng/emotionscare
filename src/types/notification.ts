
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'emotion' | 'achievement' | 'reminder' | 'social' | 'system';
export type NotificationTone = 'positive' | 'neutral' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date | string;
  tone?: NotificationTone;
  action_url?: string;
  action_text?: string;
  icon?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  channels: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
}
