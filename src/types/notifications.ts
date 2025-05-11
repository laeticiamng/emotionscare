
export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  sender_id?: string;
  recipient_id?: string;
  priority?: NotificationPriority;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'reminder';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  doNotDisturb: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
}
