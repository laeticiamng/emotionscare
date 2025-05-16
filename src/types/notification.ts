
export type NotificationType = 'system' | 'message' | 'reminder' | 'alert' | 'update' | 'achievement' | 'emotion' | 'journal' | 'coach' | 'community' | 'user' | 'urgent' | 'info' | 'warning' | 'error' | 'success';

export type NotificationFilter = 'all' | 'unread' | 'important' | 'system' | 'message' | 'read' | 'urgent' | 'journal' | 'emotion' | 'user' | 'coach' | 'community';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  read?: boolean;
  isImportant?: boolean;
  createdAt?: string;
  created_at: string;
  userId?: string;
  user_id?: string;
  recipient_id?: string;
  action?: {
    label: string;
    url: string;
  };
  action_url?: string;
  icon?: string;
  source?: 'system' | 'user' | 'coach' | 'community';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  image_url?: string;
  expires_at?: string;
  metadata?: Record<string, any>;
  timestamp?: string | Date;
  updated_at?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export type NotificationPreferences = Record<NotificationType, boolean>;
