import { useState, useEffect } from 'react';

interface FeatureFlags {
  FF_JOURNAL: boolean;
  FF_NYVEE: boolean;
  FF_DASHBOARD: boolean;
  FF_COACH: boolean;
  FF_PREMIUM_SUNO: boolean;
  FF_VR: boolean;
  FF_COMMUNITY: boolean;
  FF_SOCIAL_COCON: boolean;
  FF_MANAGER_DASH: boolean;
  FF_SCORES: boolean;
  FF_SCAN: boolean;
  FF_B2B_RH: boolean;
  FF_B2B_AGGREGATES: boolean;
  FF_ASSESS_AGGREGATE: boolean;

  // Clinical Assessment Feature Flags
  FF_ASSESS_WHO5: boolean;
  FF_ASSESS_STAI6: boolean;
  FF_ASSESS_PANAS: boolean;
  FF_ASSESS_PSS10: boolean;
  FF_ASSESS_UCLA3: boolean;
  FF_ASSESS_MSPSS: boolean;
  FF_ASSESS_AAQ2: boolean;
  FF_ASSESS_POMS: boolean;
  FF_ASSESS_POMS_TENSION: boolean;
  FF_ASSESS_SSQ: boolean;
  FF_ASSESS_ISI: boolean;
  FF_ASSESS_GAS: boolean;
  FF_ASSESS_GRITS: boolean;
  FF_ASSESS_BRS: boolean;
  FF_ASSESS_WEMWBS: boolean;
  FF_ASSESS_SWEMWBS: boolean;
  FF_ASSESS_UWES: boolean;
  FF_ASSESS_CBI: boolean;
  FF_ASSESS_CVSQ: boolean;
  FF_ASSESS_SAM: boolean;

  [key: string]: boolean;
}

// Default flags - can be overridden by API
const DEFAULT_FLAGS: FeatureFlags = {
  FF_JOURNAL: true,
  FF_NYVEE: false,
  FF_DASHBOARD: true,
  FF_COACH: false,
  FF_PREMIUM_SUNO: true,
  FF_VR: true,
  FF_COMMUNITY: true,
  FF_SOCIAL_COCON: true,
  FF_MANAGER_DASH: true,
  FF_SCORES: true,
  FF_SCAN: true,
  FF_B2B_RH: true,
  FF_B2B_AGGREGATES: true,
  FF_ASSESS_AGGREGATE: true,

  // Clinical assessments – disabled by default, opt-in via remote config
  FF_ASSESS_WHO5: true,
  FF_ASSESS_STAI6: true,
  FF_ASSESS_PANAS: true,
  FF_ASSESS_PSS10: true,
  FF_ASSESS_UCLA3: true,
  FF_ASSESS_MSPSS: true,
  FF_ASSESS_AAQ2: true,
  FF_ASSESS_POMS: true,
  FF_ASSESS_POMS_TENSION: true,
  FF_ASSESS_SSQ: true,
  FF_ASSESS_ISI: true,
  FF_ASSESS_GAS: true,
  FF_ASSESS_GRITS: true,
  FF_ASSESS_BRS: true,
  FF_ASSESS_WEMWBS: true,
  FF_ASSESS_SWEMWBS: true,
  FF_ASSESS_UWES: true,
  FF_ASSESS_CBI: true,
  FF_ASSESS_CVSQ: true,
  FF_ASSESS_SAM: true,
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