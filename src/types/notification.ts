
// Types liés aux notifications
export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'reminder' | 'system' | 'emotion' | 'challenge' | 'achievement' | 'all' | 'journal' | 'coach' | 'vr' | 'community';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never' | 'realtime' | 'custom';
export type NotificationTone = 'friendly' | 'professional' | 'motivational' | 'direct' | 'calm' | 'supportive' | 'gentle' | 'minimal' | 'casual';
export type NotificationFilter = 'all' | 'unread' | 'alerts' | 'system';

export interface NotificationBadge {
  count: number;
  type?: NotificationType;
  priority?: NotificationPriority;
  hasNew?: boolean;
  lastSeen?: string;
  badgesCount?: number;
  notificationsCount?: number;
}

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
  user_id?: string;  // Pour compatibilité
  createdAt?: string;  // Pour compatibilité
  created_at?: string; // Pour compatibilité
  date?: string;
  body?: string;
  icon?: string;
  image?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  email: boolean;
  push: boolean;
  inApp?: boolean;
  types?: Record<NotificationType, boolean>;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  type?: NotificationType;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
  className?: string;
}
