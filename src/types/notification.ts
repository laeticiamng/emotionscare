
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'journal' 
  | 'coach' 
  | 'achievement'
  | 'reminder'
  | 'alert'
  | 'message';

export type NotificationTone = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info'
  | 'neutral';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  tone?: NotificationTone;
  read: boolean;
  timestamp: string;
  action_url?: string;
  action_label?: string;
  image_url?: string;
  sender_id?: string;
  sender_name?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency;
  types: {
    system: boolean;
    emotion: boolean;
    journal: boolean;
    coach: boolean;
    achievement: boolean;
    reminder: boolean;
    alert: boolean;
    message: boolean;
  };
}

export interface NotificationFilter {
  type?: NotificationType[];
  read?: boolean;
  from?: string; // ISO date string
  to?: string; // ISO date string
  search?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface NotificationChannels {
  app: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}
