
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'minimal' | 'direct' | 'professional' | 'motivational';

export type NotificationFilter = 'all' | 'unread' | string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  createdAt?: string; // For backward compatibility
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  image?: string;
}

export type NotificationType = string;

