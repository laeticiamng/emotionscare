
export type NotificationType = 'emotion' | 'journal' | 'coaching' | 'community' | 'system';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationChannel = 'email' | 'push' | 'in-app';

export interface NotificationPreference {
  id: string;
  userId: string;
  category: string;
  frequency: NotificationFrequency;
  type?: NotificationType;
  types?: NotificationType[];
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
