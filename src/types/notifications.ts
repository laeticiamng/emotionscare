// @ts-nocheck

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'achievement' 
  | 'badge' 
  | 'reminder' 
  | 'streak' 
  | 'journal' 
  | 'emotion' 
  | 'system' 
  | 'urgent'
  | 'security';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationFilter = 
  | 'all' 
  | 'unread' 
  | 'read' 
  | NotificationType;

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
  created_at?: string;
  createdAt?: string;
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
