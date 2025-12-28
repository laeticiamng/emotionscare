/**
 * Module Notifications - Types
 * Types centralisés pour le système de notifications
 */

export type NotificationCategory = 
  | 'system'
  | 'social'
  | 'achievement'
  | 'reminder'
  | 'therapeutic'
  | 'community'
  | 'update'
  | 'badge_unlocked'
  | 'badge_progress'
  | 'challenge'
  | 'goal';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  pinned: boolean;
  snoozed_until: string | null;
  action_url: string | null;
  created_at: string;
  read_at: string | null;
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationCategory;
  priority?: NotificationPriority;
  title: string;
  message?: string;
  data?: Record<string, unknown>;
  action_url?: string;
}

export interface NotificationFilters {
  categories?: NotificationCategory[];
  priority?: NotificationPriority[];
  read?: boolean;
  pinned?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  
  // Par catégorie
  system_notifications: boolean;
  social_notifications: boolean;
  achievement_notifications: boolean;
  reminder_notifications: boolean;
  therapeutic_notifications: boolean;
  community_notifications: boolean;
  update_notifications: boolean;
  
  // Timing
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  
  // Fréquence
  daily_digest: boolean;
  weekly_digest: boolean;
  daily_reminder_time: string;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  push_enabled: true,
  email_enabled: true,
  sms_enabled: false,
  system_notifications: true,
  social_notifications: true,
  achievement_notifications: true,
  reminder_notifications: true,
  therapeutic_notifications: true,
  community_notifications: true,
  update_notifications: true,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00',
  daily_digest: false,
  weekly_digest: true,
  daily_reminder_time: '09:00',
};

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<NotificationCategory, number>;
  todayCount: number;
}
