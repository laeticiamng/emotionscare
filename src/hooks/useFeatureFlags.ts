import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FeatureFlags, 
  FeatureFlagKey, 
  getFeatureFlagsForRole, 
  isFeatureEnabled,
  DEFAULT_FLAGS,
} from '@/core/flags';

export const useFeatureFlags = () => {
  const { user } = useAuth();
  const role = user?.user_metadata?.role || user?.app_metadata?.role;

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
