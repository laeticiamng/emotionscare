
export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationFilter = 'all' | 'unread' | 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'urgent' | 'user';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  read: boolean;
  created_at: string;
  action?: {
    label: string;
    url: string;
  };
  metadata?: Record<string, any>;
}

export interface NotificationState {
  notifications: Notification[];
  hasUnread: boolean;
  filter: NotificationFilter;
}
