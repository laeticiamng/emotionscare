// @ts-nocheck
/**
 * Feature Flags Configuration
 * Permet d'activer/désactiver des fonctionnalités par tenant
 */

export type FeatureFlagKey = 
  | 'FF_B2C_PORTAL'
  | 'FF_MUSIC_THERAPY'
  | 'FF_VR'
  | 'FF_COACHING_AI'
  | 'FF_B2B_ANALYTICS'
  | 'FF_IMMERSIVE_SESSIONS';

export interface FeatureFlags {
  FF_B2C_PORTAL: boolean;
  FF_MUSIC_THERAPY: boolean;
  FF_VR: boolean;
  FF_COACHING_AI: boolean;
  FF_B2B_ANALYTICS: boolean;
  FF_IMMERSIVE_SESSIONS: boolean;
}

// Feature flags par défaut (peuvent être overridés par tenant/organisation)
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  FF_B2C_PORTAL: true,
  FF_MUSIC_THERAPY: true,
  FF_VR: true,
  FF_COACHING_AI: true,
  FF_B2B_ANALYTICS: true,
  FF_IMMERSIVE_SESSIONS: true,
};

// Feature flags par rôle (restrictions minimales)
export const ROLE_FEATURE_FLAGS: Record<string, Partial<FeatureFlags>> = {
  b2c_user: {
    FF_B2C_PORTAL: true,
    FF_MUSIC_THERAPY: true,
    FF_VR: true,
    FF_COACHING_AI: true,
    FF_IMMERSIVE_SESSIONS: true,
    FF_B2B_ANALYTICS: false,
  },
  b2b_employee: {
    FF_B2C_PORTAL: false,
    FF_MUSIC_THERAPY: true,
    FF_VR: true,
    FF_COACHING_AI: true,
    FF_IMMERSIVE_SESSIONS: true,
    FF_B2B_ANALYTICS: false,
  },
  b2b_rh: {
    FF_B2C_PORTAL: false,
    FF_MUSIC_THERAPY: false,
    FF_VR: false,
    FF_COACHING_AI: false,
    FF_IMMERSIVE_SESSIONS: false,
    FF_B2B_ANALYTICS: true,
  },
  admin: {
    FF_B2C_PORTAL: true,
    FF_MUSIC_THERAPY: true,
    FF_VR: true,
    FF_COACHING_AI: true,
    FF_IMMERSIVE_SESSIONS: true,
    FF_B2B_ANALYTICS: true,
  },
};

export const getFeatureFlagsForRole = (role: string): FeatureFlags => {
  const roleFlags = ROLE_FEATURE_FLAGS[role] || {};
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...roleFlags,
  };
};

export const isFeatureEnabled = (
  flags: Partial<FeatureFlags>,
  feature: FeatureFlagKey
): boolean => {
  return flags[feature] ?? DEFAULT_FEATURE_FLAGS[feature];
};
