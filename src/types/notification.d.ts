
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'minimal' | 'direct' | 'professional' | 'motivational';

export interface NotificationFilter {
  type?: string;
  read?: boolean;
  priority?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  image?: string;
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  icon?: string;
}
