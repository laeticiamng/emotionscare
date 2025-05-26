
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'security' | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    security: boolean;
    system: boolean;
    social: boolean;
    achievements: boolean;
    reminders: boolean;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
}
