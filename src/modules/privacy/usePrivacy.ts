/**
 * Hook React pour la gestion des préférences de confidentialité
 * Avec real-time updates et persistance Supabase
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { privacyService } from './privacyService';
import type {
  PrivacyPreferences,
  PrivacyPreferenceKey,
  PrivacyStats,
  DataExportRequest,
  ConsentRecord,
  DEFAULT_PRIVACY_PREFERENCES,
} from './types';

const LOG_CATEGORY = 'PRIVACY_HOOK';

interface UsePrivacyReturn {
  // État
  preferences: PrivacyPreferences | null;
  stats: PrivacyStats | null;
  exports: DataExportRequest[];
  consentHistory: ConsentRecord[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updatePreference: (key: PrivacyPreferenceKey, value: boolean) => Promise<boolean>;
  updateMultiplePreferences: (prefs: Partial<Record<PrivacyPreferenceKey, boolean>>) => Promise<boolean>;
  requestExport: (type: DataExportRequest['type']) => Promise<DataExportRequest | null>;
  requestDeletion: (reason?: string) => Promise<boolean>;
  cancelDeletion: () => Promise<boolean>;
  refresh: () => Promise<void>;
  
  // Helpers
  isPreferenceEnabled: (key: PrivacyPreferenceKey) => boolean;
  getEnabledPreferences: () => PrivacyPreferenceKey[];
  getDisabledPreferences: () => PrivacyPreferenceKey[];
}

export function usePrivacy(): UsePrivacyReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<PrivacyPreferences | null>(null);
  const [stats, setStats] = useState<PrivacyStats | null>(null);
  const [exports, setExports] = useState<DataExportRequest[]>([]);
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données initiales
  const loadData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [prefs, statsData, exportsData, historyData] = await Promise.all([
        privacyService.getPrivacyPreferences(user.id),
        privacyService.getPrivacyStats(user.id),
        privacyService.getDataExports(user.id),
        privacyService.getConsentHistory(user.id),
      ]);

      setPreferences(prefs);
      setStats(statsData);
      setExports(exportsData);
      setConsentHistory(historyData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
      logger.error('Error loading privacy data', err as Error, LOG_CATEGORY);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Charger au montage et quand l'utilisateur change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Écouter les changements real-time
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('privacy-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consent_history',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'data_exports',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          privacyService.getDataExports(user.id).then(setExports);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadData]);

  // Mettre à jour une préférence
  const updatePreference = useCallback(async (
    key: PrivacyPreferenceKey,
    value: boolean
  ): Promise<boolean> => {
    if (!user?.id) return false;

    // Optimistic update
    setPreferences(prev => prev ? { ...prev, [key]: value } : null);

    const success = await privacyService.updatePrivacyPreference(user.id, key, value);

    if (!success) {
      // Rollback
      setPreferences(prev => prev ? { ...prev, [key]: !value } : null);
      setError('Erreur lors de la mise à jour');
      return false;
    }

    // Recharger l'historique
    const history = await privacyService.getConsentHistory(user.id);
    setConsentHistory(history);

    return true;
  }, [user?.id]);

  // Mettre à jour plusieurs préférences
  const updateMultiplePreferences = useCallback(async (
    prefs: Partial<Record<PrivacyPreferenceKey, boolean>>
  ): Promise<boolean> => {
    if (!user?.id) return false;

    const success = await privacyService.updatePrivacyPreferences(user.id, prefs);

    if (success) {
      await loadData();
    }

    return success;
  }, [user?.id, loadData]);

  // Demander un export
  const requestExport = useCallback(async (
    type: DataExportRequest['type']
  ): Promise<DataExportRequest | null> => {
    if (!user?.id) return null;

    const exportRequest = await privacyService.requestDataExport(user.id, type);

    if (exportRequest) {
      setExports(prev => [exportRequest, ...prev]);
    }

    return exportRequest;
  }, [user?.id]);

  // Demander la suppression
  const requestDeletion = useCallback(async (reason?: string): Promise<boolean> => {
    if (!user?.id) return false;

    const result = await privacyService.requestAccountDeletion(user.id, reason);
    return result !== null;
  }, [user?.id]);

  // Annuler la suppression
  const cancelDeletion = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    return await privacyService.cancelDeletionRequest(user.id);
  }, [user?.id]);

  // Helpers
  const isPreferenceEnabled = useCallback((key: PrivacyPreferenceKey): boolean => {
    return preferences?.[key] ?? false;
  }, [preferences]);

  const getEnabledPreferences = useCallback((): PrivacyPreferenceKey[] => {
    if (!preferences) return [];
    
    const keys: PrivacyPreferenceKey[] = ['cam', 'mic', 'hr', 'gps', 'social', 'nft', 'analytics', 'personalization'];
    return keys.filter(key => preferences[key]);
  }, [preferences]);

  const getDisabledPreferences = useCallback((): PrivacyPreferenceKey[] => {
    if (!preferences) return [];
    
    const keys: PrivacyPreferenceKey[] = ['cam', 'mic', 'hr', 'gps', 'social', 'nft', 'analytics', 'personalization'];
    return keys.filter(key => !preferences[key]);
  }, [preferences]);

  return {
    preferences,
    stats,
    exports,
    consentHistory,
    isLoading,
    error,
    updatePreference,
    updateMultiplePreferences,
    requestExport,
    requestDeletion,
    cancelDeletion,
    refresh: loadData,
    isPreferenceEnabled,
    getEnabledPreferences,
    getDisabledPreferences,
  };
}

export default usePrivacy;
