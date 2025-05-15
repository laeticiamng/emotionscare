
// Types liés aux notifications
export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'reminder' | 'alert' | 'emotion' | 'journal' | 'coach' | 'vr' | 'community' | 'system' | 'all' | 'important' | 'none';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never' | 'custom' | 'realtime';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm' | 'supportive' | 'gentle';
export type NotificationFilter = 'all' | 'unread' | 'system' | 'alerts';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  timestamp: Date | string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  sender_id?: string;
  recipient_id?: string;
  priority?: NotificationPriority;
  date?: string; // Added for compatibility
  body?: string; // Added for compatibility
  createdAt?: string; // Added for compatibility
}

export interface NotificationBadge {
  count: number;
  variant?: 'default' | 'destructive' | 'outline';
  hasNew?: boolean;
  lastSeen?: string;
  badgesCount?: number;
  notificationsCount?: number;
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => Promise<void> | void;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  type?: NotificationType; // Added for compatibility
  types?: Record<string, boolean>;
  channels?: { // Added for compatibility
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  soundEnabled?: boolean;
}
