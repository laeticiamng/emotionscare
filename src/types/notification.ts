
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'friendly' | 'professional' | 'direct' | 'calm';

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
  };
}

export type NotificationType = 'emotion' | 'journal' | 'system' | 'user' | 'urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  created_at: string;
  updated_at?: string;
  action_url?: string;
  user_id?: string;
  metadata?: Record<string, any>;
  image_url?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  expires_at?: string;
}

export type NotificationFilter = 'all' | 'unread' | 'read' | 'urgent' | 'system' | 'journal' | 'emotion' | 'user';

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
