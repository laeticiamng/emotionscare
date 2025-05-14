
export type NotificationFrequency = 'daily' | 'weekly' | 'immediate' | 'digest' | 'none';
export type NotificationType = 'journal' | 'breathing' | 'music' | 'coaching' | 'system' | 'all';
export type NotificationTone = 'gentle' | 'neutral' | 'energetic' | 'minimal';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
  image?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency;
  types: Record<NotificationType, boolean>;
  tone: NotificationTone;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
