
export interface Notification {
  id: string;
  type: 'system' | 'emotion' | 'coach' | 'journal' | 'community';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationBadge {
  count: number;
  isRead: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  emailEnabled: boolean; 
  pushEnabled: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  types?: {
    [key in Notification['type']]?: boolean;
  };
}
