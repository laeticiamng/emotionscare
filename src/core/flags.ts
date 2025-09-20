import { useState, useEffect } from 'react';

interface FeatureFlags {
  FF_PREMIUM_SUNO: boolean;
  FF_VR: boolean;
  FF_COMMUNITY: boolean;
  FF_MANAGER_DASH: boolean;
  FF_SCORES: boolean;
  
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
  FF_SCORES: true,
  
  // Clinical assessments - opt-in by default
  FF_ASSESS_WHO5: true,      // Well-being thermometer - gentle weekly
  FF_ASSESS_STAI6: true,     // Anxiety state - pre/post exercises
  FF_ASSESS_PANAS: true,     // Positive/Negative affect - content personalization
  FF_ASSESS_PSS10: false,    // Perceived stress - monthly only
  FF_ASSESS_UCLA3: false,    // Loneliness - bi-weekly max
  FF_ASSESS_MSPSS: false,    // Social support - monthly
  FF_ASSESS_AAQ2: true,      // Psychological flexibility - ACT coaching
  FF_ASSESS_POMS: true,      // Mood states - music/story adaptation
  FF_ASSESS_SSQ: true,       // VR sickness - safety critical
  FF_ASSESS_ISI: false,      // Insomnia - targeted only
  FF_ASSESS_GAS: true,       // Goal attainment - ambition module
  FF_ASSESS_GRITS: false,    // Grit scale - monthly
  FF_ASSESS_BRS: false,      // Resilience - monthly
  FF_ASSESS_WEMWBS: false,   // Well-being (B2B) - organizational
  FF_ASSESS_UWES: false,     // Work engagement (B2B) - organizational
  FF_ASSESS_CBI: false,      // Burnout (B2B) - organizational
  FF_ASSESS_CVSQ: true,      // Computer vision syndrome - screen health
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