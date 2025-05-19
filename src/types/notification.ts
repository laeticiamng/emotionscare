
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'badge' | 'challenge' | 'achievement' | 'reminder' | 'info' | 'warning' | 'error' | 'success' | 'streak' | 'user' | 'urgent';
export type NotificationTone = 'gentle' | 'neutral' | 'assertive' | 'formal' | 'casual' | 'friendly' | 'professional';
export type NotificationFilter = 'all' | 'unread' | 'read' | 'urgent' | NotificationType;
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp?: string;
  created_at?: string;
  createdAt?: string;
  priority?: NotificationPriority;
}

export interface NotificationPreference {
  enabled: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface NotificationsPreferences {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: Record<NotificationType, boolean>;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  doNotDisturb: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
}
