
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never' | 'immediate';

export interface NotificationTypes {
  system?: boolean;
  emotions?: boolean;
  reports?: boolean;
  messages?: boolean;
  insights?: boolean;
  reminders?: boolean;
  achievements?: boolean;
  recommendations?: boolean;
  sessions?: boolean;
  community?: boolean;
  challenges?: boolean;
  events?: boolean;
  updates?: boolean;
  urgent?: boolean;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  category: string;
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types: NotificationTypes;
  frequency: NotificationFrequency;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationSettings {
  preferences: NotificationPreference[];
  globalEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: keyof NotificationTypes;
  isRead: boolean;
  isArchived: boolean;
  link?: string;
  createdAt: string;
  expiresAt?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}
