
export type NotificationFrequency = 
  | "immediate"
  | "daily"
  | "weekly"
  | "never";

export type NotificationType = 
  | "system"
  | "emotion"
  | "coach"
  | "journal"
  | "community"
  | "achievement"
  | "badge"
  | "challenge"
  | "reminder"
  | "info"
  | "warning"
  | "error"
  | "success"
  | "streak"
  | "urgent"; 

export type NotificationTone = 
  | "friendly"
  | "professional" 
  | "direct"
  | "motivational"
  | "neutral"
  | "casual"
  | "formal"
  | "minimal"; 

export interface NotificationPreference {
  enabled: boolean;
  frequency: NotificationFrequency;
  types: Record<NotificationType, boolean>;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  email?: boolean;
  push?: boolean;
  sms?: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  createdAt?: string;
  created_at?: string;
  actionUrl?: string;
  source?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export type NotificationFilter = 'all' | 'unread' | 'read' | 'urgent' | 'system' | 'journal' | 'emotion' | 'user' | 'achievement' | 'badge' | 'reminder' | 'streak' | 'info' | 'success' | 'warning' | 'error';

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  frequency: NotificationFrequency;
  doNotDisturb: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
  tone?: NotificationTone;
  types?: Record<NotificationType, boolean>;
  sms?: boolean;
}
