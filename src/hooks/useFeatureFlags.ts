import { useLocalStorage } from './useLocalStorage';

export interface ModeFlags {
  b2c?: boolean;
  b2b_user?: boolean;
  b2b_admin?: boolean;
}

const DEFAULT_FLAGS: ModeFlags = {
  b2c: true,
  b2b_user: true,
  b2b_admin: true,
};

/**
 * Hook managing feature flags for user modes.
 * Flags are stored in localStorage so they can be toggled at runtime.
 */
export function useFeatureFlags() {
  const [flags, setFlags] = useLocalStorage<ModeFlags>('featureFlags', DEFAULT_FLAGS);

  const setFlag = (name: keyof ModeFlags, value: boolean) => {
    setFlags(prev => ({ ...prev, [name]: value }));
  };

  return { flags, setFlag };
}

export default useFeatureFlags;
