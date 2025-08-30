import { useState, useEffect } from 'react';

interface FeatureFlags {
  FF_PREMIUM_SUNO: boolean;
  FF_VR: boolean;
  FF_COMMUNITY: boolean;
  FF_MANAGER_DASH: boolean;
  [key: string]: boolean;
}

// Default flags - can be overridden by API
const DEFAULT_FLAGS: FeatureFlags = {
  FF_PREMIUM_SUNO: false,
  FF_VR: false,
  FF_COMMUNITY: false,
  FF_MANAGER_DASH: false,
};

let flagsCache: FeatureFlags | null = null;

export function useFlags() {
  const [flags, setFlags] = useState<FeatureFlags>(flagsCache || DEFAULT_FLAGS);

  useEffect(() => {
    async function loadFlags() {
      try {
        // Don't fetch if we already have cached flags
        if (flagsCache) return;

        const response = await fetch('/me/feature_flags', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          const newFlags = { ...DEFAULT_FLAGS, ...data.flags };
          flagsCache = newFlags;
          setFlags(newFlags);
        }
      } catch (error) {
        console.warn('Failed to load feature flags, using defaults:', error);
      }
    }

    loadFlags();
  }, []);

  return {
    flags,
    has: (flagName: string) => flags[flagName] === true,
    refresh: async () => {
      flagsCache = null;
      // Trigger re-fetch on next render
      setFlags(DEFAULT_FLAGS);
    }
  };
}