
export type NotificationFilter = 'all' | 'unread' | 'read' | 'urgent' | 'system' | 'journal' | 'emotion' | 'user';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'emotion' | 'journal' | 'system' | 'user' | 'urgent';
  read: boolean;
  created_at: string;
  updated_at?: string;
  action_url?: string;
  user_id?: string;
  metadata?: Record<string, any>;
  image_url?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  expires_at?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
}
