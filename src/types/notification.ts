
// Notification-related types

export interface NotificationPreference {
  id?: string;
  userId?: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  type?: string;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
    badge?: boolean;
    challenge?: boolean;
    reminder?: boolean;
    info?: boolean;
    warning?: boolean;
    error?: boolean;
    success?: boolean;
    streak?: boolean;
    urgent?: boolean;
  };
}

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never' | 'immediate';
export type NotificationTone = 'formal' | 'friendly' | 'motivational' | 'minimal';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  userId: string;
  read: boolean;
  createdAt: string;
  timestamp?: string;
  action_text?: string;
  action_link?: string;
  metadata?: Record<string, any>;
  image?: string;
  icon?: string;
  priority?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasError: boolean;
}

export interface NotificationAction {
  type: string;
  label: string;
  icon?: string;
  url?: string;
  action?: () => void;
}
