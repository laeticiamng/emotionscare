/**
 * Types pour le système de notifications
 */

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'reminder' 
  | 'achievement' 
  | 'social' 
  | 'system';

export type NotificationChannel = 'push' | 'email' | 'in_app' | 'sms';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
    sms: boolean;
  };
  categories: {
    reminders: boolean;
    achievements: boolean;
    social: boolean;
    marketing: boolean;
    system: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string;   // HH:mm
  };
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}
