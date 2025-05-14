
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'monthly';
export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system' | 'reminder' | 'wellness' | 'tip';
export type NotificationTone = 'standard' | 'friendly' | 'professional' | 'urgent' | 'minimal';

// Create objects for these enums to use as values
export const NotificationFrequency = {
  REALTIME: 'realtime' as NotificationFrequency,
  DAILY: 'daily' as NotificationFrequency,
  WEEKLY: 'weekly' as NotificationFrequency,
  MONTHLY: 'monthly' as NotificationFrequency
};

export const NotificationType = {
  INFO: 'info' as NotificationType,
  WARNING: 'warning' as NotificationType,
  SUCCESS: 'success' as NotificationType,
  ERROR: 'error' as NotificationType,
  SYSTEM: 'system' as NotificationType,
  REMINDER: 'reminder' as NotificationType,
  WELLNESS: 'wellness' as NotificationType,
  TIP: 'tip' as NotificationType
};

export const NotificationTone = {
  STANDARD: 'standard' as NotificationTone,
  FRIENDLY: 'friendly' as NotificationTone,
  PROFESSIONAL: 'professional' as NotificationTone,
  URGENT: 'urgent' as NotificationTone,
  MINIMAL: 'minimal' as NotificationTone
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
  isRead?: boolean; // Adding for compatibility
  createdAt?: string; // Adding for compatibility
  userId?: string;
  linkTo?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}
