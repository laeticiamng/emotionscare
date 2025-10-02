/**
 * Feature Flags System - Unified
 * Système unifié de gestion des feature flags
 */

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

export interface FeatureFlags {
  // Core features
  FF_JOURNAL: boolean;
  FF_NYVEE: boolean;
  FF_DASHBOARD: boolean;
  FF_COACH: boolean;
  FF_MUSIC: boolean;
  FF_PREMIUM_SUNO: boolean;
  FF_VR: boolean;
  FF_COMMUNITY: boolean;
  FF_SOCIAL_COCON: boolean;
  
  // B2C Features
  FF_B2C_PORTAL: boolean;
  FF_MUSIC_THERAPY: boolean;
  FF_COACHING_AI: boolean;
  FF_IMMERSIVE_SESSIONS: boolean;
  
  // Orchestration
  FF_ORCH_COMMUNITY: boolean;
  FF_ORCH_SOCIAL_COCON: boolean;
  FF_ORCH_AURAS: boolean;
  FF_ORCH_AMBITION: boolean;
  FF_ORCH_GRIT: boolean;
  FF_ORCH_BUBBLE: boolean;
  FF_ORCH_MIXER: boolean;
  FF_ORCH_STORY: boolean;
  FF_ORCH_ACTIVITY: boolean;
  FF_ORCH_SCREENSILK: boolean;
  FF_ORCH_WEEKLYBARS: boolean;
  
  // B2B Features
  FF_MANAGER_DASH: boolean;
  FF_B2B_RH: boolean;
  FF_B2B_HEATMAP: boolean;
  FF_B2B_AGGREGATES: boolean;
  FF_B2B_ANALYTICS: boolean;
  
  // Scores & Scan
  FF_SCORES: boolean;
  FF_SCAN: boolean;
  FF_SCAN_SAM: boolean;
  
  // Clinical Assessments
  FF_ASSESS_AGGREGATE: boolean;
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
  
  // Special flags
  FF_ZERO_NUMBERS?: boolean;
  FF_REQUIRE_CLINICAL_OPTIN: boolean;

  [key: string]: boolean | undefined;
}

export type FeatureFlagKey = keyof FeatureFlags;

// Default flags - can be overridden by API or role
export const DEFAULT_FLAGS: FeatureFlags = {
  // Core features
  FF_JOURNAL: true,
  FF_NYVEE: false,
  FF_DASHBOARD: true,
  FF_COACH: true,
  FF_MUSIC: true,
  FF_PREMIUM_SUNO: true,
  FF_VR: true,
  FF_COMMUNITY: true,
  FF_SOCIAL_COCON: true,
  
  // B2C Features
  FF_B2C_PORTAL: true,
  FF_MUSIC_THERAPY: true,
  FF_COACHING_AI: true,
  FF_IMMERSIVE_SESSIONS: true,
  
  // Orchestration
  FF_ORCH_COMMUNITY: true,
  FF_ORCH_SOCIAL_COCON: true,
  FF_ORCH_AURAS: true,
  FF_ORCH_AMBITION: true,
  FF_ORCH_GRIT: true,
  FF_ORCH_BUBBLE: true,
  FF_ORCH_MIXER: true,
  FF_ORCH_STORY: true,
  FF_ORCH_ACTIVITY: true,
  FF_ORCH_SCREENSILK: true,
  FF_ORCH_WEEKLYBARS: true,
  
  // B2B Features
  FF_MANAGER_DASH: true,
  FF_B2B_RH: true,
  FF_B2B_HEATMAP: true,
  FF_B2B_AGGREGATES: true,
  FF_B2B_ANALYTICS: true,
  
  // Scores & Scan
  FF_SCORES: true,
  FF_SCAN: true,
  FF_SCAN_SAM: true,
  
  // Clinical assessments
  FF_ASSESS_AGGREGATE: true,
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
  
  // Special flags
  FF_ZERO_NUMBERS: true,
  FF_REQUIRE_CLINICAL_OPTIN: true,
};

// Feature flags by role
export const ROLE_FEATURE_FLAGS: Record<string, Partial<FeatureFlags>> = {
  consumer: {
    FF_B2C_PORTAL: true,
    FF_MUSIC_THERAPY: true,
    FF_VR: true,
    FF_COACHING_AI: true,
    FF_IMMERSIVE_SESSIONS: true,
    FF_B2B_ANALYTICS: false,
    FF_MANAGER_DASH: false,
    FF_B2B_RH: false,
  },
  employee: {
    FF_B2C_PORTAL: false,
    FF_MUSIC_THERAPY: true,
    FF_VR: true,
    FF_COACHING_AI: true,
    FF_IMMERSIVE_SESSIONS: true,
    FF_B2B_ANALYTICS: false,
    FF_MANAGER_DASH: false,
    FF_B2B_RH: false,
  },
  manager: {
    FF_B2C_PORTAL: false,
    FF_MUSIC_THERAPY: false,
    FF_VR: false,
    FF_COACHING_AI: false,
    FF_IMMERSIVE_SESSIONS: false,
    FF_B2B_ANALYTICS: true,
    FF_MANAGER_DASH: true,
    FF_B2B_RH: true,
  },
  admin: {
    // Admin has access to everything
  },
};

export const getFeatureFlagsForRole = (role: string): FeatureFlags => {
  const roleFlags = ROLE_FEATURE_FLAGS[role] || {};
  return {
    ...DEFAULT_FLAGS,
    ...roleFlags,
  };
};

export const isFeatureEnabled = (
  flags: Partial<FeatureFlags>,
  feature: FeatureFlagKey
): boolean => {
  return flags[feature] ?? DEFAULT_FLAGS[feature] ?? false;
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
          logger.debug('Feature flags loaded from API', { flagsCount: Object.keys(newFlags).length }, 'SYSTEM');
        }
      } catch (error) {
        logger.warn('Failed to load feature flags, using defaults', error as Error, 'SYSTEM');
      }
    }

    loadFlags();
  }, []);

  return {
    flags,
    has: (flagName: string) => flags[flagName as FeatureFlagKey] === true,
    refresh: async () => {
      flagsCache = null;
      setFlags(DEFAULT_FLAGS);
    }
  };
}
