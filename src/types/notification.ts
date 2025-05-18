
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';

export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'coach' 
  | 'journal' 
  | 'community' 
  | 'achievement'
  | 'badge'
  | 'challenge'
  | 'reminder'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'streak'
  | 'urgent';

export type NotificationFilter = NotificationType | 'all' | 'read' | 'unread';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  user_id: string;
  action_link?: string;
  action_text?: string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  icon?: string;
  image?: string;
}

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  frequency?: NotificationFrequency;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
    badge?: boolean;
    challenge?: boolean;
    reminder?: boolean;
    info?: boolean;
    warning?: boolean;
    error?: boolean;
    success?: boolean;
    streak?: boolean;
    urgent?: boolean;
    [key: string]: boolean | undefined;
  };
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  inApp?: boolean;
  tone?: NotificationTone;
}
