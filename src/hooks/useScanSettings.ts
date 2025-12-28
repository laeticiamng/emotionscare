/**
 * useScanSettings - Hook pour persister les settings scan vers Supabase
 * Remplace localStorage pour scan_statistics, scan_history, favorite_scan_methods
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

const SCAN_STATS_KEY = 'scan:statistics';
const SCAN_HISTORY_KEY = 'scan:history';
const FAVORITE_METHODS_KEY = 'scan:favorite_methods';
const SCAN_DRAFT_KEY = 'scan:draft';

export interface ScanStats {
  totalScans: number;
  scansByMethod: Record<string, number>;
  lastScanDate: string | null;
  averageEmotionScore: number;
  streakDays: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface ScanHistoryEntry {
  id: string;
  date: string;
  method: string;
  emotion: string;
  score: number;
}

const defaultStats: ScanStats = {
  totalScans: 0,
  scansByMethod: {},
  lastScanDate: null,
  averageEmotionScore: 0,
  streakDays: 0,
  weeklyGoal: 7,
  weeklyProgress: 0
};

export function useScanSettings() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ScanStats>(defaultStats);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [favoriteMethods, setFavoriteMethods] = useState<string[]>([]);
  const [draft, setDraft] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from Supabase
  const loadSettings = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('key, value')
        .eq('user_id', user.id)
        .in('key', [SCAN_STATS_KEY, SCAN_HISTORY_KEY, FAVORITE_METHODS_KEY, SCAN_DRAFT_KEY]);

      if (error) {
        logger.error('Failed to load scan settings', error, 'SCAN');
        return;
      }

      data?.forEach((item: { key: string; value: any }) => {
        try {
          const value = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          switch (item.key) {
            case SCAN_STATS_KEY:
              setStats({ ...defaultStats, ...value });
              break;
            case SCAN_HISTORY_KEY:
              setHistory(Array.isArray(value) ? value : []);
              break;
            case FAVORITE_METHODS_KEY:
              setFavoriteMethods(Array.isArray(value) ? value : []);
              break;
            case SCAN_DRAFT_KEY:
              setDraft(value);
              break;
          }
        } catch (e) {
          logger.warn('Failed to parse scan setting', { key: item.key }, 'SCAN');
        }
      });
    } catch (e) {
      logger.error('Error loading scan settings', e, 'SCAN');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save to Supabase with debounce
  const saveToSupabase = useCallback(async (key: string, value: any) => {
    if (!user) return;

    try {
      const jsonValue = JSON.stringify(value);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key,
          value: jsonValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });

      if (error) {
        logger.error('Failed to save scan setting', { key, error }, 'SCAN');
      }
    } catch (e) {
      logger.error('Error saving scan setting', { key, e }, 'SCAN');
    }
  }, [user]);

  // Debounced save
  const debouncedSave = useCallback((key: string, value: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(key, value);
    }, 500);
  }, [saveToSupabase]);

  // Load on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Update stats
  const updateStats = useCallback((newStats: Partial<ScanStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      debouncedSave(SCAN_STATS_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Add history entry
  const addHistoryEntry = useCallback((entry: Omit<ScanHistoryEntry, 'id'>) => {
    setHistory(prev => {
      const newEntry = { ...entry, id: Date.now().toString() };
      const updated = [newEntry, ...prev].slice(0, 100);
      debouncedSave(SCAN_HISTORY_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Toggle favorite method
  const toggleFavoriteMethod = useCallback((methodId: string) => {
    setFavoriteMethods(prev => {
      const updated = prev.includes(methodId)
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId];
      debouncedSave(FAVORITE_METHODS_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Save draft
  const saveDraft = useCallback((draftData: any) => {
    setDraft(draftData);
    debouncedSave(SCAN_DRAFT_KEY, draftData);
  }, [debouncedSave]);

  // Clear draft
  const clearDraft = useCallback(async () => {
    setDraft(null);
    if (user) {
      await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id)
        .eq('key', SCAN_DRAFT_KEY);
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    stats,
    history,
    favoriteMethods,
    draft,
    isLoading,
    updateStats,
    addHistoryEntry,
    toggleFavoriteMethod,
    saveDraft,
    clearDraft,
    reload: loadSettings
  };
}

export default useScanSettings;
