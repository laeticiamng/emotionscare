
export type NotificationType = 'info' | 'warning' | 'success' | 'error';
export type NotificationFrequency = 'daily' | 'weekly' | 'never';
export type NotificationTone = 'default' | 'gentle' | 'energetic' | 'calm';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date?: string;
  timestamp?: string;
  createdAt?: string;
  isRead?: boolean;
  read?: boolean; // For backward compatibility
  action?: {
    type: string;
    payload?: any;
    label?: string;
    url?: string;
  };
  user_id?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  frequency?: NotificationFrequency;
  time?: string;
}

export interface NotificationBadge {
  count: number;
  badgeCount?: number;
  notificationsCount?: number;
  setBadgeCount: (count: number) => void;
  badgesCount?: number; // For backward compatibility
  setBadgesCount?: (count: number) => void; // For backward compatibility
}
