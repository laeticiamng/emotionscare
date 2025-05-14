
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'off';
export type NotificationType = 'all' | 'important' | 'mentions' | 'direct' | 'none';
export type NotificationTone = 'professional' | 'casual' | 'supportive' | 'minimal';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  timestamp?: string;
  createdAt?: string;
  action?: {
    type: string;
    route: string;
    text: string;
  };
  priority?: 'high' | 'medium' | 'low';
  image?: string;
  icon?: string;
}

export interface NotificationPreference {
  type: NotificationType;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  emailEnabled: boolean;
  pushEnabled: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  doNotDisturb?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    exceptions: string[];
  };
}
