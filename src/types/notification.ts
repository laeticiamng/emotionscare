
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement?: boolean;
    badge?: boolean;
    challenge?: boolean;
    reminder?: boolean;
    info?: boolean;
    warning?: boolean;
    error?: boolean;
    success?: boolean;
    streak?: boolean;
    urgent?: boolean;
  };
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'achievement' | 'badge' | 'challenge' | 'reminder' | 'info' | 'warning' | 'error' | 'success' | 'streak' | 'urgent';

export type NotificationFilter = NotificationType;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  action?: {
    label: string;
    url: string;
  };
  icon?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
