
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'system' | 'success' | 'warning' | 'info' | 'error' | 'invitation' | 'reminder';
  read: boolean;
  createdAt: string;
  timestamp?: string;
  date?: string;
  isRead?: boolean;
  linkTo?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

export interface NotificationOptions {
  id?: string;
  title: string;
  message: string;
  type?: 'system' | 'success' | 'warning' | 'info' | 'error' | 'invitation' | 'reminder';
  linkTo?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

export interface EnhancedNotification extends Notification {
  priority: 'high' | 'medium' | 'low';
  category: string;
}
