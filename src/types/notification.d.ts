
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
  createdAt?: string; // Pour la rétrocompatibilité
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  image?: string;
}

// Définir NotificationType pour inclure tous les types possibles
export type NotificationType = string | 'system' | 'emotion' | 'badge';
