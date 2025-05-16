
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
  actionUrl?: string;
  actionLabel?: string;
  action_url?: string;
  action_label?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  compact?: boolean;
  onRead?: (id: string) => void;
}
