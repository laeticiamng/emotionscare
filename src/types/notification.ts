
// Notification Types Definition

export interface NotificationTypes {
  system: string;
  achievements: string;
  reminders: string;
  wellness: string;
  community: string;
  invitations: string;
  messages: string;
  updates: string;
  news: string;
  alerts: string;
  emotions: string;
  insights: string;
  achievement?: string;
  reminder?: string;
  urgent?: string;
}

export type NotificationType = keyof NotificationTypes | string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read?: boolean; // For backward compatibility
  isRead?: boolean;
  isArchived?: boolean;
  userId?: string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  icon?: string;
  image?: string;
  actionUrl?: string;
  actionText?: string;
  timestamp?: string;
  imageUrl?: string;
  label?: string;
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'none' | 'immediate';

export type NotificationTone = 'standard' | 'gentle' | 'focused' | 'none' | 'friendly';

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  id?: string;
  userId?: string;
  category?: string;
}
