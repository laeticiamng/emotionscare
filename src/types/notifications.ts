
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  created_at?: string;
  createdAt?: string;
}

export type NotificationType = 'system' | 'emotion' | 'challenge' | 'achievement' | 'reminder' | 'info' | 'warning' | 'error' | 'success' | 'journal' | 'user' | 'urgent';

export type NotificationFilter = 'all' | 'unread' | 'read' | NotificationType;

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  doNotDisturb: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
}
