
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationType = 'alert' | 'reminder' | 'insight' | 'achievement';
export type NotificationTone = 'formal' | 'friendly' | 'motivational' | 'minimal' | 'technical';

export const NotificationFrequency = {
  IMMEDIATE: 'immediate' as NotificationFrequency,
  DAILY: 'daily' as NotificationFrequency,
  WEEKLY: 'weekly' as NotificationFrequency,
  NEVER: 'never' as NotificationFrequency
};

export const NotificationType = {
  ALERT: 'alert' as NotificationType,
  REMINDER: 'reminder' as NotificationType,
  INSIGHT: 'insight' as NotificationType,
  ACHIEVEMENT: 'achievement' as NotificationType
};

export const NotificationTone = {
  FORMAL: 'formal' as NotificationTone,
  FRIENDLY: 'friendly' as NotificationTone,
  MOTIVATIONAL: 'motivational' as NotificationTone,
  MINIMAL: 'minimal' as NotificationTone,
  TECHNICAL: 'technical' as NotificationTone
};

export interface NotificationPreference {
  emailFrequency: NotificationFrequency;
  pushFrequency: NotificationFrequency;
  types: NotificationType[];
  tone: NotificationTone;
  muteAll: boolean;
  quiet_hours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  date?: string;
  timestamp?: string;
  action?: {
    type: string;
    payload?: any;
  };
}
