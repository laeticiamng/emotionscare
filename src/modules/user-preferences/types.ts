/**
 * Module User Preferences - Types
 * Types pour settings, profile, privacy et notifications
 */

import { z } from 'zod';

// ============================================================================
// USER PROFILE
// ============================================================================

export const UserProfile = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  display_name: z.string().min(1).max(100),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  university: z.string().max(200).nullable().optional(),
  year_of_study: z.number().int().min(1).max(10).nullable().optional(),
  speciality: z.string().max(100).nullable().optional(),
  preferences: z.record(z.unknown()).nullable().optional(),
  achievements: z.record(z.unknown()).nullable().optional(),
  total_study_time: z.number().int().min(0).nullable().optional(),
  study_streak: z.number().int().min(0).nullable().optional(),
  current_score_average: z.number().min(0).max(100).nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});
export type UserProfile = z.infer<typeof UserProfile>;

export interface UpdateUserProfile {
  display_name?: string;
  avatar_url?: string | null;
  bio?: string | null;
  university?: string | null;
  year_of_study?: number | null;
  speciality?: string | null;
  preferences?: Record<string, unknown> | null;
}

// ============================================================================
// SETTINGS
// ============================================================================

export const SettingsCategory = z.enum([
  'general',
  'appearance',
  'notifications',
  'privacy',
  'accessibility',
  'language',
  'therapeutic'
]);
export type SettingsCategory = z.infer<typeof SettingsCategory>;

export const UserSettings = z.object({
  // General
  language: z.string().default('fr'),
  timezone: z.string().default('Europe/Paris'),

  // Appearance
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  color_scheme: z.string().default('default'),
  font_size: z.enum(['small', 'medium', 'large']).default('medium'),

  // Notifications
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(false),
  reminder_notifications: z.boolean().default(true),
  social_notifications: z.boolean().default(true),
  weekly_reports: z.boolean().default(true),
  achievement_notifications: z.boolean().default(true),

  // Privacy
  profile_visibility: z.enum(['public', 'friends', 'private']).default('friends'),
  data_sharing: z.boolean().default(false),
  analytics_tracking: z.boolean().default(true),
  emotion_data_retention_days: z.number().int().positive().default(365),

  // Accessibility
  high_contrast: z.boolean().default(false),
  reduce_animations: z.boolean().default(false),
  screen_reader_mode: z.boolean().default(false),

  // Therapeutic
  daily_reminder_time: z.string().nullable().optional(),
  preferred_modules: z.array(z.string()).default([]),
  auto_suggestions: z.boolean().default(true),
  emotion_tracking_frequency: z.enum(['low', 'medium', 'high']).default('medium')
});
export type UserSettings = z.infer<typeof UserSettings>;

export type PartialUserSettings = Partial<UserSettings>;

// ============================================================================
// PRIVACY & CONSENT
// ============================================================================

export const ConsentType = z.enum([
  'audio',
  'video',
  'emotionAnalysis',
  'dataStorage',
  'dataSharing',
  'analytics',
  'marketing'
]);
export type ConsentType = z.infer<typeof ConsentType>;

export const ConsentOptions = z.object({
  audio: z.boolean().default(false),
  video: z.boolean().default(false),
  emotionAnalysis: z.boolean().default(false),
  dataStorage: z.boolean().default(true),
  dataSharing: z.boolean().default(false),
  analytics: z.boolean().default(true),
  marketing: z.boolean().default(false)
});
export type ConsentOptions = z.infer<typeof ConsentOptions>;

export const ConsentRecord = z.object({
  user_id: z.string().uuid(),
  consents: ConsentOptions,
  version: z.string(),
  timestamp: z.string().datetime(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional()
});
export type ConsentRecord = z.infer<typeof ConsentRecord>;

export const PrivacySettings = z.object({
  profile_visibility: z.enum(['public', 'friends', 'private']).default('friends'),
  show_activity_status: z.boolean().default(true),
  show_achievements: z.boolean().default(true),
  show_statistics: z.boolean().default(false),
  allow_friend_requests: z.boolean().default(true),
  data_retention_days: z.number().int().positive().default(365),
  auto_delete_old_data: z.boolean().default(false)
});
export type PrivacySettings = z.infer<typeof PrivacySettings>;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const NotificationCategory = z.enum([
  'system',
  'social',
  'achievement',
  'reminder',
  'therapeutic',
  'community',
  'update'
]);
export type NotificationCategory = z.infer<typeof NotificationCategory>;

export const NotificationPriority = z.enum(['low', 'medium', 'high', 'urgent']);
export type NotificationPriority = z.infer<typeof NotificationPriority>;

export const Notification = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category: NotificationCategory,
  priority: NotificationPriority.default('medium'),
  title: z.string().min(1).max(200),
  message: z.string().max(1000),
  action_url: z.string().url().nullable().optional(),
  read: z.boolean().default(false),
  archived: z.boolean().default(false),
  metadata: z.record(z.unknown()).nullable().optional(),
  created_at: z.string().datetime(),
  read_at: z.string().datetime().nullable().optional()
});
export type Notification = z.infer<typeof Notification>;

export const NotificationPreferences = z.object({
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(false),
  sms_notifications: z.boolean().default(false),

  // Per category
  system_notifications: z.boolean().default(true),
  social_notifications: z.boolean().default(true),
  achievement_notifications: z.boolean().default(true),
  reminder_notifications: z.boolean().default(true),
  therapeutic_notifications: z.boolean().default(true),
  community_notifications: z.boolean().default(true),
  update_notifications: z.boolean().default(true),

  // Timing
  quiet_hours_enabled: z.boolean().default(false),
  quiet_hours_start: z.string().nullable().optional(), // HH:mm format
  quiet_hours_end: z.string().nullable().optional(),

  // Digest
  daily_digest: z.boolean().default(false),
  weekly_digest: z.boolean().default(true)
});
export type NotificationPreferences = z.infer<typeof NotificationPreferences>;

export interface CreateNotification {
  user_id: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  title: string;
  message: string;
  action_url?: string | null;
  metadata?: Record<string, unknown> | null;
}

// ============================================================================
// DATA EXPORT
// ============================================================================

export const DataExportFormat = z.enum(['json', 'csv', 'pdf']);
export type DataExportFormat = z.infer<typeof DataExportFormat>;

export const DataExportScope = z.enum([
  'all',
  'profile',
  'emotions',
  'sessions',
  'achievements',
  'journal',
  'statistics'
]);
export type DataExportScope = z.infer<typeof DataExportScope>;

export interface DataExportRequest {
  user_id: string;
  format: DataExportFormat;
  scope: DataExportScope[];
  date_from?: string;
  date_to?: string;
}

export interface DataExportResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  expires_at?: string;
  error_message?: string;
}

// ============================================================================
// ACCOUNT MANAGEMENT
// ============================================================================

export const AccountStatus = z.enum(['active', 'suspended', 'deactivated', 'deleted']);
export type AccountStatus = z.infer<typeof AccountStatus>;

export interface AccountDeletionRequest {
  user_id: string;
  reason?: string;
  feedback?: string;
  delete_immediately: boolean; // false = soft delete with grace period
}

export interface AccountDeletionResult {
  success: boolean;
  deletion_scheduled_for?: string;
  grace_period_days?: number;
  error?: string;
}

// ============================================================================
// PREFERENCES BUNDLE (All-in-one)
// ============================================================================

export interface UserPreferencesBundle {
  profile: UserProfile;
  settings: UserSettings;
  privacy: PrivacySettings;
  notifications: NotificationPreferences;
  consents: ConsentOptions;
}
