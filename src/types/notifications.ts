
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'system' | 'emotion' | 'challenge' | 'achievement' | 'reminder';
  read: boolean;
  timestamp: string;  // For compatibility with existing code
  createdAt: string;  // For compatibility with existing code
  created_at: string; // Standard format
}

export type NotificationType = 'system' | 'emotion' | 'challenge' | 'achievement' | 'reminder' | 'info' | 'warning' | 'error' | 'success' | 'journal' | 'user' | 'urgent';

export type NotificationFilter = 'all' | 'unread' | 'read' | 'urgent' | 'system' | 'journal' | 'emotion' | 'user';

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
