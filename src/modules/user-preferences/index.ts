/**
 * Module User Preferences
 * Module unifié pour settings, profile, privacy et notifications
 * @version 1.0.0
 */

// ============================================================================
// SERVICE
// ============================================================================

export {
  UserPreferencesService,
  userPreferencesService,
  default as userPreferencesServiceDefault
} from './userPreferencesService';

// ============================================================================
// HOOKS
// ============================================================================

export { useUserPreferences } from './useUserPreferences';
export { useNotifications } from './useNotifications';

// ============================================================================
// TYPES
// ============================================================================

export type {
  UserProfile,
  UpdateUserProfile,
  UserSettings,
  PartialUserSettings,
  SettingsCategory,
  ConsentType,
  ConsentOptions,
  ConsentRecord,
  PrivacySettings,
  Notification,
  NotificationCategory,
  NotificationPriority,
  NotificationPreferences,
  CreateNotification,
  DataExportFormat,
  DataExportScope,
  DataExportRequest,
  DataExportResult,
  AccountStatus,
  AccountDeletionRequest,
  AccountDeletionResult,
  UserPreferencesBundle
} from './types';

// ============================================================================
// SCHEMAS (Zod)
// ============================================================================

export {
  UserProfile as UserProfileSchema,
  UserSettings as UserSettingsSchema,
  SettingsCategory as SettingsCategorySchema,
  ConsentType as ConsentTypeSchema,
  ConsentOptions as ConsentOptionsSchema,
  ConsentRecord as ConsentRecordSchema,
  PrivacySettings as PrivacySettingsSchema,
  Notification as NotificationSchema,
  NotificationCategory as NotificationCategorySchema,
  NotificationPriority as NotificationPrioritySchema,
  NotificationPreferences as NotificationPreferencesSchema,
  DataExportFormat as DataExportFormatSchema,
  DataExportScope as DataExportScopeSchema,
  AccountStatus as AccountStatusSchema
} from './types';
