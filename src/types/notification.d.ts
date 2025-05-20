
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
}

export type NotificationType = keyof NotificationTypes | string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean; // For backward compatibility
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
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'none';

export type NotificationTone = 'standard' | 'gentle' | 'focused' | 'none';

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  tone: NotificationTone;
}
