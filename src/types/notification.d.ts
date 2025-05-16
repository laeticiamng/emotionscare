
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 'emotion' | 'journal' | 'system' | 'user' | 'urgent';

export type NotificationTone = 'informative' | 'celebratory' | 'motivational' | 'urgent' | 'neutral';

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sms?: boolean;
}

export type NotificationFilter = 'all' | 'unread' | 'read' | 'urgent' | 'system' | 'journal' | 'emotion' | 'user';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
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

export interface NotificationPreference {
  type: NotificationType | 'all';
  enabled: boolean;
  frequency: NotificationFrequency;
  channels: NotificationChannels;
  tone?: NotificationTone;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}
