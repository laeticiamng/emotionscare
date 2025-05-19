
export type NotificationType = 'emotion' | 'journal' | 'coaching' | 'community' | 'system' | 'achievement' | 'badge' | 'challenge' | 'reminder' | 'info' | 'warning' | 'error' | 'success' | 'streak' | 'urgent';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationChannel = 'email' | 'push' | 'in-app';

export interface NotificationPreference {
  id: string;
  userId: string;
  category: string;
  frequency: NotificationFrequency;
  type?: NotificationType;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
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
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface NotificationSettings {
  preferences: NotificationPreference[];
  globalEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

export interface NotificationMessage {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  priority?: 'low' | 'medium' | 'high';
}
