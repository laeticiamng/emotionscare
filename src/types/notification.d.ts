
export type NotificationType = 
  | 'emotion' 
  | 'journal' 
  | 'community' 
  | 'achievement' 
  | 'reminder' 
  | 'system'
  | 'success'
  | 'warning'
  | 'error'
  | 'alert'
  | 'message';

export type NotificationFilter = 
  | 'all'
  | 'unread'
  | NotificationType;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  time?: string;
  date?: string;
  createdAt?: string;
  action_url?: string;
  actionUrl?: string;
  action_label?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
  userId?: string;
  priority?: 'low' | 'medium' | 'high';
  image?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onRead?: (id: string) => void;
  compact?: boolean;
}

export interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  loading?: boolean;
}
