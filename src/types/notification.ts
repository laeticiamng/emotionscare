
export type NotificationType = 'system' | 'emotion' | 'recommendation' | 'team' | 'goal';

export type NotificationFilter = 'all' | 'unread' | 'read' | 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'urgent';

export interface NotificationAction {
  label: string;
  url: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp?: string;
  created_at?: string;
  action?: NotificationAction;
  priority?: 'normal' | 'urgent';
}
