/**
 * Profile Module
 * Export centralisé du module de gestion du profil
 */

// Types - Explicit exports for better tree-shaking
export type {
  UserProfile,
  ProfilePreferences,
  ProfileStats,
  Achievement,
  AchievementRarity,
  AchievementCategory,
  UserBadge,
  ActiveSession,
  SecurityInfo,
  ActivityHistoryItem,
  ProfileExportData,
  UpdateProfileInput,
  UpdatePreferencesInput,
} from './types';

export {
  DEFAULT_PREFERENCES,
  DEFAULT_STATS,
  calculateLevel,
  getRarityColor,
  getProfileCompletionPercentage,
} from './types';

// Service
export { profileService } from './profileService';

// Hook
export { useProfile, default as useProfileHook } from './useProfile';
