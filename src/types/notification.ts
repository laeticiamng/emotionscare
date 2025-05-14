
export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum NotificationType {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app'
}

export enum NotificationTone {
  FORMAL = 'formal',
  FRIENDLY = 'friendly',
  PROFESSIONAL = 'professional',
  CASUAL = 'casual',
  ENCOURAGING = 'encouraging'
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  action_url?: string;
  action_label?: string;
  icon?: string;
  createdAt: string;
  updatedAt?: string;
}
