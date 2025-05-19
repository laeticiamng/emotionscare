
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'coach' 
  | 'journal' 
  | 'community' 
  | 'achievement'
  | 'badge'
  | 'challenge'
  | 'reminder'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'streak'
  | 'urgent';

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read'
  | NotificationType;

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
  tone?: string;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export type NotificationsPreferences = NotificationPreference;
