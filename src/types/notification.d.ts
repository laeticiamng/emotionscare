
export type NotificationFrequency = 'daily' | 'weekly' | 'immediate' | 'digest' | 'none';
export type NotificationType = 'journal' | 'breathing' | 'music' | 'coaching' | 'system' | 'all' | 'important';
export type NotificationTone = 'professional' | 'casual' | 'supportive' | 'minimal' | 'gentle' | 'neutral' | 'energetic';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body?: string;
  message?: string;
  type: NotificationType;
  read?: boolean;
  isRead?: boolean;
  timestamp?: string;
  createdAt: string;
  link?: string;
  image?: string;
}

export interface NotificationPreference {
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
  frequency?: NotificationFrequency;
  type?: NotificationType;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
