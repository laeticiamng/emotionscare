// @ts-nocheck
import { useMemo } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuth';
import { 
  FeatureFlags, 
  FeatureFlagKey, 
  getFeatureFlagsForRole, 
  isFeatureEnabled 
} from '@/config/featureFlags';

export const useFeatureFlags = () => {
  const { user, role } = useSimpleAuth();

  const flags = useMemo<FeatureFlags>(() => {
    if (!user || !role) {
      return {
        FF_B2C_PORTAL: false,
        FF_MUSIC_THERAPY: false,
        FF_VR: false,
        FF_COACHING_AI: false,
        FF_B2B_ANALYTICS: false,
        FF_IMMERSIVE_SESSIONS: false,
      };
    }

    return getFeatureFlagsForRole(role);
  }, [user, role]);

  const isEnabled = (feature: FeatureFlagKey): boolean => {
    return isFeatureEnabled(flags, feature);
  };

  return {
    flags,
    isEnabled,
  };
};
