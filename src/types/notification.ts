
// Notification-related types

export interface NotificationPreference {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'motivational' | 'minimal';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  userId: string;  // renamed from user_id
  read: boolean;
  createdAt: string; // renamed from created_at
  timestamp?: string;
  action_text?: string;
  action_link?: string;
  metadata?: Record<string, any>;
  image?: string;
  icon?: string;
  priority?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasError: boolean;
}

export interface NotificationAction {
  type: string;
  label: string;
  icon?: string;
  url?: string;
  action?: () => void;
}
