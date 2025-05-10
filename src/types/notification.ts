
export enum NotificationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  FLEXIBLE = 'flexible',
  NONE = 'none'
}

export enum NotificationType {
  MINIMAL = 'minimal',
  DETAILED = 'detailed',
  FULL = 'full',
  ALL = 'all',
  IMPORTANT = 'important',
  NONE = 'none'
}

export enum NotificationTone {
  MINIMALIST = 'minimalist',
  POETIC = 'poetic',
  DIRECTIVE = 'directive',
  SILENT = 'silent',
  MOTIVATING = 'motivating',
  GENTLE = 'gentle'
}

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
