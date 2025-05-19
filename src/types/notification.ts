
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'badge' | 'challenge' | 'achievement' | 'reminder';
export type NotificationTone = 'gentle' | 'neutral' | 'assertive';

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
