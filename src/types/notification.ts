
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly' | 'never' | 'immediate';
export type NotificationTone = 'friendly' | 'neutral' | 'formal' | 'casual' | 'direct' | 'professional' | 'motivational';
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder' | 'badge' | 'streak' | 'system' | 'emotion';

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  frequency?: NotificationFrequency;
  tone?: NotificationTone;
  time?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration?: boolean;
  dailySummary?: boolean;
  weeklyReport?: boolean;
  achievementAlerts?: boolean;
  reminderAlerts?: boolean;
  newContentAlerts?: boolean;
  emailNotifications?: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  createdAt?: string;
  created_at?: string;
}

export type NotificationFilter = 'all' | 'unread' | NotificationType;
