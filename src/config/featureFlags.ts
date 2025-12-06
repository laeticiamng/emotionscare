/**
 * Feature Flags Configuration - DEPRECATED
 * ⚠️ Ce fichier est conservé pour la compatibilité
 * Utilisez src/core/flags.ts à la place
 */

// Re-export from unified flags system
export type {
  FeatureFlags,
  FeatureFlagKey,
} from '@/core/flags';

export {
  DEFAULT_FLAGS as DEFAULT_FEATURE_FLAGS,
  ROLE_FEATURE_FLAGS,
  getFeatureFlagsForRole,
  isFeatureEnabled,
} from '@/core/flags';
