
export type NotificationType = 'system' | 'message' | 'reminder' | 'alert' | 'update' | 'achievement';

export type NotificationFilter = 'all' | 'unread' | 'important' | 'system' | 'message';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
  userId?: string;
  action?: {
    label: string;
    url: string;
  };
  icon?: string;
  source?: 'system' | 'user' | 'coach' | 'community';
}

export interface NotificationPreference {
  type: NotificationType;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export type NotificationPreferences = Record<NotificationType, boolean>;
