/**
 * useFlags - Hook de feature flags avec support Supabase et localStorage
 * Permet la gestion dynamique des fonctionnalités avec persistance
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  rollout_percentage?: number;
  target_users?: string[];
  target_roles?: string[];
  metadata?: Record<string, unknown>;
}

interface FlagsConfig {
  enabledFlags: Record<string, boolean>;
  lastFetched: string | null;
}

const STORAGE_KEY = 'feature_flags';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Flags par défaut (fallback)
const DEFAULT_FLAGS: Record<string, boolean> = {
  // Modules principaux
  'module.journal': true,
  'module.scan': true,
  'module.music': true,
  'module.coach': true,
  'module.breath': true,
  'module.exchange': true,
  'module.emotional-park': true,
  'module.meditation': true,
  
  // Fonctionnalités expérimentales
  'experimental.ai-coach': true,
  'experimental.hume-ai': false,
  'experimental.vr-mode': false,
  'experimental.ar-filters': false,
  
  // B2B features
  'b2b.analytics': true,
  'b2b.team-dashboard': true,
  'b2b.export-reports': true,
  
  // Gamification
  'gamification.achievements': true,
  'gamification.leaderboard': true,
  'gamification.streaks': true,
  
  // Notifications
  'notifications.push': true,
  'notifications.email': true,
  'notifications.in-app': true,
  
  // UI/UX
  'ui.dark-mode': true,
  'ui.animations': true,
  'ui.haptics': true,
  'ui.accessibility-mode': true,
};

export const useFlags = () => {
  const { user } = useAuth();
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed: FlagsConfig = JSON.parse(cached);
        return { ...DEFAULT_FLAGS, ...parsed.enabledFlags };
      } catch {
        return DEFAULT_FLAGS;
      }
    }
    return DEFAULT_FLAGS;
  });
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  /**
   * Charger les flags depuis Supabase
   */
  const loadFlags = useCallback(async (forceRefresh = false) => {
    // Vérifier le cache
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached && !forceRefresh) {
      try {
        const parsed: FlagsConfig = JSON.parse(cached);
        if (parsed.lastFetched) {
          const lastFetch = new Date(parsed.lastFetched);
          if (Date.now() - lastFetch.getTime() < CACHE_DURATION) {
            setFlags({ ...DEFAULT_FLAGS, ...parsed.enabledFlags });
            setLastFetched(lastFetch);
            return;
          }
        }
      } catch {
        // Ignorer les erreurs de parsing
      }
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('enabled', true);

      if (error) {
        logger.warn('Failed to load feature flags, using defaults', error, 'FLAGS');
        return;
      }

      const fetchedFlags: Record<string, boolean> = { ...DEFAULT_FLAGS };
      
      if (data) {
        for (const flag of data as FeatureFlag[]) {
          // Vérifier le rollout percentage
          if (flag.rollout_percentage !== undefined && flag.rollout_percentage < 100) {
            const userHash = user?.id ? hashCode(user.id) : Math.random() * 100;
            const normalizedHash = Math.abs(userHash % 100);
            fetchedFlags[flag.key] = normalizedHash < flag.rollout_percentage;
          }
          // Vérifier les utilisateurs ciblés
          else if (flag.target_users?.length && user?.id) {
            fetchedFlags[flag.key] = flag.target_users.includes(user.id);
          }
          // Flag activé pour tous
          else {
            fetchedFlags[flag.key] = flag.enabled;
          }
        }
      }

      setFlags(fetchedFlags);
      setLastFetched(new Date());

      // Mettre à jour le cache
      const cacheData: FlagsConfig = {
        enabledFlags: fetchedFlags,
        lastFetched: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      logger.error('Error loading feature flags', err as Error, 'FLAGS');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Charger les flags au montage
  useEffect(() => {
    loadFlags();
  }, [loadFlags]);

  /**
   * Vérifier si un flag est actif
   */
  const isEnabled = useCallback((flagKey: string): boolean => {
    return flags[flagKey] ?? DEFAULT_FLAGS[flagKey] ?? false;
  }, [flags]);

  /**
   * Vérifier plusieurs flags
   */
  const areEnabled = useCallback((flagKeys: string[]): boolean => {
    return flagKeys.every((key) => isEnabled(key));
  }, [isEnabled]);

  /**
   * Vérifier si au moins un flag est actif
   */
  const anyEnabled = useCallback((flagKeys: string[]): boolean => {
    return flagKeys.some((key) => isEnabled(key));
  }, [isEnabled]);

  /**
   * Obtenir la valeur d'un flag avec metadata
   */
  const getFlag = useCallback((flagKey: string): { enabled: boolean; value: boolean } => {
    const enabled = isEnabled(flagKey);
    return { enabled, value: enabled };
  }, [isEnabled]);

  /**
   * Mettre à jour un flag localement (pour dev/testing)
   */
  const setFlag = useCallback((flagKey: string, enabled: boolean) => {
    setFlags((prev) => {
      const updated = { ...prev, [flagKey]: enabled };
      const cacheData: FlagsConfig = {
        enabledFlags: updated,
        lastFetched: lastFetched?.toISOString() || null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      return updated;
    });
  }, [lastFetched]);

  /**
   * Réinitialiser aux valeurs par défaut
   */
  const resetFlags = useCallback(() => {
    setFlags(DEFAULT_FLAGS);
    localStorage.removeItem(STORAGE_KEY);
    setLastFetched(null);
  }, []);

  // Liste des flags disponibles
  const availableFlags = useMemo(() => Object.keys(flags), [flags]);

  return {
    // État
    flags,
    loading,
    lastFetched,
    availableFlags,
    
    // Vérification
    isEnabled,
    areEnabled,
    anyEnabled,
    getFlag,
    
    // Gestion
    setFlag,
    resetFlags,
    refreshFlags: () => loadFlags(true),
  };
};

/**
 * Fonction de hachage simple pour le rollout
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

export default useFlags;
