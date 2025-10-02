import { useMemo } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuth';
import { 
  FeatureFlags, 
  FeatureFlagKey, 
  getFeatureFlagsForRole, 
  isFeatureEnabled,
  DEFAULT_FLAGS,
} from '@/core/flags';

export const useFeatureFlags = () => {
  const { user, role } = useSimpleAuth();

  const flags = useMemo<FeatureFlags>(() => {
    if (!user || !role) {
      return DEFAULT_FLAGS;
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
