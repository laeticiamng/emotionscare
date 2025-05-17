
export type NotificationFrequency = 'daily' | 'weekly' | 'never' | 'real-time';

export type NotificationTone = 'professional' | 'friendly' | 'supportive';

export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'badge' 
  | 'achievement'
  | 'journal' 
  | 'community' 
  | 'coach' 
  | 'reminder'
  | 'streak'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency?: NotificationFrequency;
  tone?: NotificationTone;
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  timestamp: string;
  user_id: string;
  metadata?: Record<string, any>;
  link?: string;
  // Compatibilité avec l'existant
  createdAt?: string;
}

export type NotificationFilter = 
  | 'all' 
  | 'unread' 
  | 'read'
  | 'achievement'
  | 'badge'
  | 'reminder'
  | 'streak'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'system'
  | 'journal'
  | 'emotion'
  | 'user'
  | 'urgent';

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}
