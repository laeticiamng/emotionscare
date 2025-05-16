
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
  createdAt: string;
  date?: string;
  action_url?: string;
  action_label?: string;
  // Add backwards compatibility properties
  actionUrl?: string;
  actionLabel?: string;
  timestamp?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  onRead?: (id: string) => void;
}
