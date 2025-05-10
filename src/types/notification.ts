
export type NotificationFrequency = 'daily' | 'weekly' | 'flexible' | 'none';
export type NotificationType = 'minimal' | 'detailed' | 'full';
export type NotificationTone = 'minimalist' | 'poetic' | 'directive' | 'silent';

export interface NotificationPreferencesProps {
  frequency: NotificationFrequency;
  type: NotificationType;
  tone: NotificationTone;
  onFrequencyChange: (frequency: NotificationFrequency) => void;
  onTypeChange: (type: NotificationType) => void; 
  onToneChange: (tone: NotificationTone) => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  created_at: string | Date;
  read: boolean;
  link?: string;
  user_id: string;
}
