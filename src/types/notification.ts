
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';

export interface NotificationPreference {
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  frequency?: NotificationFrequency;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  types?: {
    system?: boolean;
    emotion?: boolean;
    badge?: boolean;
    challenge?: boolean;
    message?: boolean;
    update?: boolean;
    mention?: boolean;
    team?: boolean;
    report?: boolean;
    reminder?: boolean;
    activity?: boolean;
    alert?: boolean;
    important?: boolean;
    urgent?: boolean;
  };
  category?: string;
  type?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  type: string;
  createdAt: string;
  created_at?: string;
  userId?: string;
  timestamp?: string;
  icon?: string;
  action?: string;
  actionUrl?: string;
  category?: string;
}

export type NotificationFilter = string;
export type NotificationType = string;
