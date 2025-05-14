
// Notification types and interfaces

/**
 * Notification frequency options
 */
export enum NotificationFrequency {
  REALTIME = 'realtime',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  IMMEDIATE = 'immediate' // Adding this to fix the error
}

/**
 * Notification type options
 */
export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
  SYSTEM = 'system',
  REMINDER = 'reminder',
  WELLNESS = 'wellness',
  TIP = 'tip',
  IN_APP = 'in_app' // Adding this to fix the error
}

/**
 * Notification tone options
 */
export enum NotificationTone {
  STANDARD = 'standard',
  FRIENDLY = 'friendly',
  PROFESSIONAL = 'professional',
  URGENT = 'urgent',
  MINIMAL = 'minimal',
  FORMAL = 'formal', // Adding these to fix the errors
  CASUAL = 'casual',
  ENCOURAGING = 'encouraging'
}

/**
 * Notification model
 */
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  created_at: string;
  read: boolean;
  read_at?: string;
  action_url?: string;
  icon?: string;
  image_url?: string;
  priority?: 'low' | 'normal' | 'high';
  category?: string;
  sender?: string;
  context_data?: Record<string, any>;
  createdAt?: string; // Alias for created_at
}

/**
 * Notification preferences
 */
export interface NotificationPreference {
  id?: string;
  user_id: string;
  enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  frequency: NotificationFrequency;
  types?: NotificationType[];
  quiet_hours?: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  categories?: string[];
  tone?: NotificationTone;
}
