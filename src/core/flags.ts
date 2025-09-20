import { useState, useEffect } from 'react';

interface FeatureFlags {
  FF_PREMIUM_SUNO: boolean;
  FF_VR: boolean;
  FF_COMMUNITY: boolean;
  FF_MANAGER_DASH: boolean;
  
  // Clinical Assessment Feature Flags
  FF_ASSESS_WHO5: boolean;
  FF_ASSESS_STAI6: boolean;
  FF_ASSESS_PANAS: boolean;
  FF_ASSESS_PSS10: boolean;
  FF_ASSESS_UCLA3: boolean;
  FF_ASSESS_MSPSS: boolean;
  FF_ASSESS_AAQ2: boolean;
  FF_ASSESS_POMS: boolean;
  FF_ASSESS_SSQ: boolean;
  FF_ASSESS_ISI: boolean;
  FF_ASSESS_GAS: boolean;
  FF_ASSESS_GRITS: boolean;
  FF_ASSESS_BRS: boolean;
  FF_ASSESS_WEMWBS: boolean;
  FF_ASSESS_UWES: boolean;
  FF_ASSESS_CBI: boolean;
  FF_ASSESS_CVSQ: boolean;
  
  [key: string]: boolean;
}

// Default flags - can be overridden by API
const DEFAULT_FLAGS: FeatureFlags = {
  FF_PREMIUM_SUNO: true,
  FF_VR: true,
  FF_COMMUNITY: true,
  FF_MANAGER_DASH: true,
  
  // Clinical assessments – disabled by default, opt-in via remote config
  FF_ASSESS_WHO5: false,
  FF_ASSESS_STAI6: false,
  FF_ASSESS_PANAS: false,
  FF_ASSESS_PSS10: false,
  FF_ASSESS_UCLA3: false,
  FF_ASSESS_MSPSS: false,
  FF_ASSESS_AAQ2: false,
  FF_ASSESS_POMS: false,
  FF_ASSESS_SSQ: false,
  FF_ASSESS_ISI: false,
  FF_ASSESS_GAS: false,
  FF_ASSESS_GRITS: false,
  FF_ASSESS_BRS: false,
  FF_ASSESS_WEMWBS: false,
  FF_ASSESS_UWES: false,
  FF_ASSESS_CBI: false,
  FF_ASSESS_CVSQ: false,
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