
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'minimal' | 'direct' | 'professional' | 'motivational';

export type NotificationFilter = 'all' | 'unread' | string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string; // Keep as createdAt to match usage in code
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  image?: string;
}

export type NotificationType = string;

