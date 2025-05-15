
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never';

export type NotificationType = 'system' | 'emotion' | 'coach' | 'journal' | 'community' | 'invitation' | 'reminder' | 'info' | 'warning' | 'success' | 'error' | 'alert';

export type NotificationTone = 'neutral' | 'supportive' | 'professional' | 'friendly';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string | Date;
  read: boolean;
  userId?: string;
  action?: string;
  actionUrl?: string;  // Added for compatibility
  actionLabel?: string; // Added for compatibility
  icon?: string;
  priority?: number;
  category?: string;
  source?: string;
  createdAt?: string;
  body?: string;
  date?: string | Date;  // Added for compatibility with different implementations
}

export interface NotificationBadge {
  count: number;
  active: boolean;
  badgesCount?: number;
  notificationsCount?: number;
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
  emailEnabled?: boolean;
  pushEnabled?: boolean;
}

// Adding compatibility with types referenced in hooks and components
export type NotificationFilter = 'all' | 'unread' | NotificationType;
