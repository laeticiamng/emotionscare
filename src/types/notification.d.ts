
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  userId?: string;
  action?: string;
  link?: string;
}

export type NotificationType =
  | 'INFO'
  | 'WARNING'
  | 'SUCCESS'
  | 'ERROR'
  | 'SYSTEM'
  | 'REMINDER'
  | 'WELLNESS'
  | 'TIP';

export type NotificationChannel = 'EMAIL' | 'PUSH' | 'IN_APP' | 'SMS';

export type NotificationFrequency = 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'IMMEDIATE';

export type NotificationTone = 'STANDARD' | 'FRIENDLY' | 'PROFESSIONAL' | 'URGENT' | 'MINIMAL' | 'FORMAL' | 'CASUAL' | 'ENCOURAGING';

export interface NotificationPreference {
  enabled: boolean;
  channels: NotificationChannel[];
  frequency: NotificationFrequency;
  tone: NotificationTone;
  types: NotificationType[];
}
