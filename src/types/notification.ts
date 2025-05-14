
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'monthly' | 'immediate';
export type NotificationType = 'success' | 'warning' | 'info' | 'error' | 'reminder' | 'wellness' | 'tip' | 'recommendation' | 'system' | 'in_app';
export type NotificationTone = 'standard' | 'friendly' | 'professional' | 'urgent' | 'minimal' | 'formal' | 'casual' | 'encouraging';

export const NotificationFrequency = {
  REALTIME: 'realtime' as NotificationFrequency,
  DAILY: 'daily' as NotificationFrequency,
  WEEKLY: 'weekly' as NotificationFrequency,
  MONTHLY: 'monthly' as NotificationFrequency,
  IMMEDIATE: 'immediate' as NotificationFrequency
};

export const NotificationType = {
  SUCCESS: 'success' as NotificationType,
  WARNING: 'warning' as NotificationType,
  INFO: 'info' as NotificationType,
  ERROR: 'error' as NotificationType,
  SYSTEM: 'system' as NotificationType,
  REMINDER: 'reminder' as NotificationType,
  WELLNESS: 'wellness' as NotificationType,
  TIP: 'tip' as NotificationType,
  IN_APP: 'in_app' as NotificationType,
  RECOMMENDATION: 'recommendation' as NotificationType
};

export const NotificationTone = {
  STANDARD: 'standard' as NotificationTone,
  FRIENDLY: 'friendly' as NotificationTone,
  PROFESSIONAL: 'professional' as NotificationTone,
  URGENT: 'urgent' as NotificationTone,
  MINIMAL: 'minimal' as NotificationTone,
  FORMAL: 'formal' as NotificationTone,
  CASUAL: 'casual' as NotificationTone,
  ENCOURAGING: 'encouraging' as NotificationTone
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date?: string;
  createdAt?: string;
  timestamp?: string;
  read?: boolean;
  isRead?: boolean;
  actionUrl?: string;
  userId?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency | string;
  types?: NotificationType[];
  tone?: NotificationTone;
}
