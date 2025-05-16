
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
  | 'alert';

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
  actionUrl?: string;  // Added for compatibility
  actionLabel?: string; // Added for compatibility
  date?: string; // Added for compatibility
  priority?: 'high' | 'medium' | 'low';
  image?: string;
  related_id?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  frequency: NotificationFrequency;
  types: Record<NotificationType, boolean>;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  inAppEnabled?: boolean;
  soundEnabled?: boolean;
  type?: 'all' | 'important' | 'none';
}

export type NotificationFilter = 'all' | 'unread' | NotificationType | string;

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
