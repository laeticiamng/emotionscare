
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
  timestamp?: string;
  date?: string;
  createdAt?: string;
  action_url?: string;
  actionUrl?: string;
  action_label?: string;
  actionLabel?: string;
  userId?: string;
  category?: string;
  priority?: number;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency;
  types: Record<NotificationType, boolean>;
  channels?: NotificationChannels;
}

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sms?: boolean;
}

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'none';

export type NotificationTone = 'professional' | 'friendly' | 'urgent' | 'calm';

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
  onRead?: (id: string) => void;
}
