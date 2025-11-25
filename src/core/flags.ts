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
  
  // Parcours XL Features
  FF_PARCOURS_XL: boolean;
  FF_AUTO_DETECT_HUME: boolean;
  FF_VOICEOVER_VOCALS: boolean;
  FF_PARCOURS_EXTEND: boolean;
  FF_PARCOURS_FALLBACK: boolean;
  
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
  
  // Parcours XL Features
  FF_PARCOURS_XL: true,
  FF_AUTO_DETECT_HUME: true,
  FF_VOICEOVER_VOCALS: false, // Suno vocals en phase 2
  FF_PARCOURS_EXTEND: true,
  FF_PARCOURS_FALLBACK: true,
  
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
let flagsFetchPromise: Promise<FeatureFlags> | null = null;

/**
 * Fetch feature flags from Supabase
 */
async function fetchFeatureFlags(userId?: string, role?: string): Promise<FeatureFlags> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');

    // Récupérer les flags globaux
    const { data: globalFlags, error: globalError } = await supabase
      .from('feature_flags')
      .select('flag_name, enabled')
      .eq('is_global', true);

    if (globalError) {
      logger.warn('Failed to fetch global feature flags', globalError, 'SYSTEM');
      return DEFAULT_FLAGS;
    }

    // Construire les flags depuis la base de données
    const dbFlags: Partial<FeatureFlags> = {};
    if (globalFlags) {
      globalFlags.forEach((flag: { flag_name: string; enabled: boolean }) => {
        dbFlags[flag.flag_name as FeatureFlagKey] = flag.enabled;
      });
    }

    // Si on a un utilisateur, récupérer ses flags personnalisés
    if (userId) {
      const { data: userFlags, error: userError } = await supabase
        .from('user_feature_flags')
        .select('flag_name, enabled')
        .eq('user_id', userId);

      if (!userError && userFlags) {
        userFlags.forEach((flag: { flag_name: string; enabled: boolean }) => {
          dbFlags[flag.flag_name as FeatureFlagKey] = flag.enabled;
        });
      }
    }

    // Appliquer les flags de rôle
    const roleFlags = role ? ROLE_FEATURE_FLAGS[role] || {} : {};

    // Fusionner: DEFAULT < DB < ROLE < USER
    return {
      ...DEFAULT_FLAGS,
      ...dbFlags,
      ...roleFlags,
    };
  } catch (error) {
    logger.warn('Feature flags fetch failed, using defaults', error, 'SYSTEM');
    return DEFAULT_FLAGS;
  }
}

export function useFlags() {
  const [flags, setFlags] = useState<FeatureFlags>(flagsCache || DEFAULT_FLAGS);
  const [isLoading, setIsLoading] = useState(!flagsCache);

  useEffect(() => {
    const loadFlags = async () => {
      // Si déjà en cache, ne pas recharger
      if (flagsCache) {
        setFlags(flagsCache);
        setIsLoading(false);
        return;
      }

      // Si une requête est déjà en cours, attendre
      if (flagsFetchPromise) {
        const result = await flagsFetchPromise;
        setFlags(result);
        setIsLoading(false);
        return;
      }

      try {
        // Tenter de récupérer l'utilisateur courant
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        // Récupérer le rôle depuis le profil si disponible
        let userRole: string | undefined;
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          userRole = profile?.role;
        }

        // Lancer la récupération des flags
        flagsFetchPromise = fetchFeatureFlags(user?.id, userRole);
        const result = await flagsFetchPromise;

        flagsCache = result;
        setFlags(result);
        logger.debug('Feature flags loaded', { flagsCount: Object.keys(result).length }, 'SYSTEM');
      } catch (error) {
        logger.warn('Failed to load feature flags, using defaults', error, 'SYSTEM');
        flagsCache = DEFAULT_FLAGS;
        setFlags(DEFAULT_FLAGS);
      } finally {
        flagsFetchPromise = null;
        setIsLoading(false);
      }
    };

    loadFlags();
  }, []);

  return {
    flags,
    isLoading,
    has: (flagName: string) => flags[flagName as FeatureFlagKey] === true,
    refresh: async () => {
      setIsLoading(true);
      flagsCache = null;
      flagsFetchPromise = null;
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();
        let userRole: string | undefined;
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          userRole = profile?.role;
        }
        const newFlags = await fetchFeatureFlags(user?.id, userRole);
        flagsCache = newFlags;
        setFlags(newFlags);
      } catch (error) {
        logger.warn('Failed to refresh feature flags', error, 'SYSTEM');
        setFlags(DEFAULT_FLAGS);
      } finally {
        setIsLoading(false);
      }
    }
  };
}
