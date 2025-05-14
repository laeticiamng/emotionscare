
export type NotificationType = 'all' | 'important' | 'minimal' | 'system' | 'emotion' | 'challenge' | 'achievement' | 'reminder' | 'info' | 'warning' | 'success' | 'error';
export type NotificationFrequency = 'real-time' | 'hourly' | 'daily' | 'weekly' | 'immediate' | 'never';
export type NotificationTone = 'friendly' | 'professional' | 'minimalist' | 'motivational' | 'direct' | 'calm';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationPreference {
  type: NotificationType;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message?: string;
  body?: string;
  type: NotificationType;
  link?: string;
  actionUrl?: string;
  read?: boolean;
  timestamp?: string;
  createdAt?: string;
  created_at?: string;
  date?: string;
  sender_id?: string;
  recipient_id?: string;
  priority?: NotificationPriority;
  user_id?: string;
}
