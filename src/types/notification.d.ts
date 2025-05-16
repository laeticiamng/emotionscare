
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'hourly';

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

export type NotificationTone = 'professional' | 'casual' | 'supportive' | 'minimal';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action_url?: string;
  action_label?: string;
  date?: string; // Deprecated, use timestamp instead
  actionUrl?: string;  // Deprecated, use action_url instead
  actionLabel?: string; // Deprecated, use action_label instead
  priority?: 'high' | 'medium' | 'low';
  image?: string;
  related_id?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled?: boolean;
  soundEnabled?: boolean;
  frequency: NotificationFrequency;
  types: Record<NotificationType, boolean>;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  type?: 'all' | 'important' | 'none';
}

export type NotificationFilter = 'all' | 'unread' | NotificationType;

export interface NotificationChannels {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
  onRead?: (id: string) => void;
}
