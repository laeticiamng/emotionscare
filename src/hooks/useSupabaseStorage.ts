/**
 * useSupabaseStorage - Hook centralisé pour la persistance Supabase
 * Remplace localStorage avec sync cloud + fallback local
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface UseSupabaseStorageOptions<T> {
  defaultValue: T;
  syncInterval?: number; // ms, 0 = no auto-sync
  enableRealtime?: boolean;
}

// Cache en mémoire pour performance
const memoryCache = new Map<string, { value: unknown; timestamp: number }>();
const CACHE_TTL = 30000; // 30 secondes

/**
 * Hook pour stocker des données dans Supabase avec fallback localStorage
 */
export function useSupabaseStorage<T>(
  key: string,
  options: UseSupabaseStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => Promise<void>, { loading: boolean; syncing: boolean; error: Error | null }] {
  const { user } = useAuth();
  const [value, setValue] = useState<T>(options.defaultValue);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pendingSave = useRef<T | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storageKey = user ? `${user.id}:${key}` : `anon:${key}`;

  // Charger depuis cache mémoire, puis Supabase, puis localStorage
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Check memory cache first
        const cached = memoryCache.get(storageKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setValue(cached.value as T);
          setLoading(false);
          return;
        }

        // 2. Try Supabase if authenticated
        if (user) {
          const { data, error: fetchError } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', key)
            .maybeSingle();

          if (fetchError) {
            logger.warn(`[SupabaseStorage] Fetch error for ${key}:`, fetchError, 'STORAGE');
          } else if (data?.value !== undefined) {
            const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
            setValue(parsed);
            memoryCache.set(storageKey, { value: parsed, timestamp: Date.now() });
            setLoading(false);
            return;
          }
        }

        // 3. Fallback to localStorage
        const localData = localStorage.getItem(storageKey);
        if (localData) {
          const parsed = JSON.parse(localData);
          setValue(parsed);
          memoryCache.set(storageKey, { value: parsed, timestamp: Date.now() });
          
          // Sync to Supabase if authenticated
          if (user) {
            await syncToSupabase(key, parsed, user.id);
          }
        } else {
          setValue(options.defaultValue);
        }
      } catch (e) {
        logger.error(`[SupabaseStorage] Load error for ${key}:`, e, 'STORAGE');
        setError(e as Error);
        
        // Final fallback to default
        setValue(options.defaultValue);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id, key]);

  // Realtime subscription
  useEffect(() => {
    if (!user || !options.enableRealtime) return;

    const channel = supabase
      .channel(`storage-${key}-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if ((payload.new as any)?.key === key) {
            const newValue = (payload.new as any)?.value;
            if (newValue !== undefined) {
              const parsed = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
              setValue(parsed);
              memoryCache.set(storageKey, { value: parsed, timestamp: Date.now() });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, key, options.enableRealtime]);

  // Sauvegarder avec debounce
  const saveValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    const resolvedValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(value) 
      : newValue;

    // Mise à jour optimiste
    setValue(resolvedValue);
    memoryCache.set(storageKey, { value: resolvedValue, timestamp: Date.now() });

    // Toujours sauvegarder en local (fallback immédiat)
    try {
      localStorage.setItem(storageKey, JSON.stringify(resolvedValue));
    } catch (e) {
      logger.warn('[SupabaseStorage] localStorage save failed', e, 'STORAGE');
    }

    // Debounce la sauvegarde Supabase
    pendingSave.current = resolvedValue;
    
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      if (!user || pendingSave.current === null) return;

      setSyncing(true);
      try {
        await syncToSupabase(key, pendingSave.current, user.id);
        pendingSave.current = null;
      } catch (e) {
        logger.error(`[SupabaseStorage] Sync error for ${key}:`, e, 'STORAGE');
        setError(e as Error);
      } finally {
        setSyncing(false);
      }
    }, 500); // 500ms debounce
  }, [user?.id, key, value, storageKey]);

  return [value, saveValue, { loading, syncing, error }];
}

// Helper pour sync vers Supabase
async function syncToSupabase(key: string, value: unknown, userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      key,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,key'
    });

  if (error) {
    throw error;
  }
}

/**
 * Hook simplifié pour des préférences utilisateur simples
 */
export function useUserPreference<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue, { loading }] = useSupabaseStorage<T>(key, {
    defaultValue,
    enableRealtime: false
  });

  return [value, setValue, loading];
}

/**
 * Hook pour historique avec limite de taille
 */
export function useHistoryStorage<T>(
  key: string,
  maxItems: number = 100
): {
  history: T[];
  addItem: (item: T) => Promise<void>;
  removeItem: (predicate: (item: T) => boolean) => Promise<void>;
  clearHistory: () => Promise<void>;
  loading: boolean;
} {
  const [history, setHistory, { loading }] = useSupabaseStorage<T[]>(key, {
    defaultValue: [],
    enableRealtime: false
  });

  const addItem = useCallback(async (item: T) => {
    await setHistory((prev) => {
      const updated = [item, ...prev].slice(0, maxItems);
      return updated;
    });
  }, [setHistory, maxItems]);

  const removeItem = useCallback(async (predicate: (item: T) => boolean) => {
    await setHistory((prev) => prev.filter((item) => !predicate(item)));
  }, [setHistory]);

  const clearHistory = useCallback(async () => {
    await setHistory([]);
  }, [setHistory]);

  return { history, addItem, removeItem, clearHistory, loading };
}

/**
 * Migrer des données localStorage existantes vers Supabase
 */
export async function migrateLocalStorageToSupabase(
  userId: string,
  keys: string[]
): Promise<{ migrated: string[]; failed: string[] }> {
  const migrated: string[] = [];
  const failed: string[] = [];

  for (const key of keys) {
    try {
      const localData = localStorage.getItem(key);
      if (!localData) continue;

      const parsed = JSON.parse(localData);
      
      await syncToSupabase(key, parsed, userId);
      
      // Supprimer l'ancien key localStorage
      localStorage.removeItem(key);
      migrated.push(key);
    } catch (e) {
      logger.error(`[Migration] Failed for ${key}:`, e, 'STORAGE');
      failed.push(key);
    }
  }

  return { migrated, failed };
}

export default useSupabaseStorage;
