
export type NotificationType = 
  | 'system' 
  | 'achievement' 
  | 'challenge' 
  | 'reminder' 
  | 'message' 
  | 'friend_request' 
  | 'group_invitation' 
  | 'event' 
  | 'milestone' 
  | 'update' 
  | 'promotion'
  | 'invitation';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string | Date;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
  priority?: 'low' | 'normal' | 'high';
  category?: string;
  expiry?: string | Date;
  data?: Record<string, any>;
  userId?: string;
}

// Notification preferences
export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  frequency: NotificationFrequency;
  channels: NotificationChannel[];
  timePreference?: 'any' | 'morning' | 'afternoon' | 'evening';
}

export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationChannel = 'app' | 'email' | 'sms' | 'push';
