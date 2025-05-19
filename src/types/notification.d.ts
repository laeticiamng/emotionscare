
export type NotificationType = 'emotion' | 'journal' | 'coaching' | 'community' | 'system' | 'achievement' | 'badge' | 'challenge' | 'reminder' | 'info' | 'warning' | 'error' | 'success' | 'streak' | 'urgent';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never' | 'realtime';
export type NotificationChannel = 'email' | 'push' | 'in-app';
export type NotificationTone = 'formal' | 'friendly' | 'motivational' | 'minimal';

export interface NotificationPreference {
  id: string;
  userId: string;
  category: string;
  frequency: NotificationFrequency;
  type?: NotificationType;
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
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  tone?: NotificationTone;
}

export interface NotificationSettings {
  preferences: NotificationPreference[];
  globalEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

export interface NotificationMessage {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  priority?: 'low' | 'medium' | 'high';
}

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
