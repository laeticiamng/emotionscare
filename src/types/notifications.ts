
export type NotificationType =
  | 'system'
  | 'emotion'
  | 'coach'
  | 'journal'
  | 'community'
  | 'achievement'
  | 'badge'
  | 'challenge'
  | 'reminder'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'streak'
  | 'urgent';

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read'
  | NotificationType;

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string | Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  icon?: string;
  imageUrl?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  source?: 'system' | 'user' | 'application';
}
