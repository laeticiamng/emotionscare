
// Types liés aux notifications et préférences

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'achievement' 
  | 'social' 
  | 'reminder'
  | 'coach'
  | 'journal'
  | 'music'
  | 'vr'
  | 'buddy';

export interface NotificationPreference {
  id: string;
  userId: string;
  channel: string;
  frequency: NotificationFrequency;
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: NotificationType[];
  type?: string;
  settings?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  user_id?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: string;
  createdAt?: string;
  created_at?: string;
  data?: any;
}

export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  action?: {
    type: string;
    label: string;
    url?: string;
    data?: any;
  };
  icon?: string;
}
