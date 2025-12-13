// @ts-nocheck
/**
 * useLocalStorage - Hook avec chiffrement automatique
 * Utilise secureStorage en interne pour protection RGPD Art. 32
 * Compatible drop-in avec l'ancienne API localStorage
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getSecureItem, setSecureItem, removeSecureItem } from '@/lib/secureStorage';
import { logger } from '@/lib/logger';

/** Type de sérialisation */
export type SerializationType = 'json' | 'string' | 'number' | 'boolean' | 'date' | 'custom';

/** Configuration du storage */
export interface StorageConfig<T> {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  validator?: (value: unknown) => value is T;
  onError?: (error: Error) => void;
  syncTabs?: boolean;
  expiration?: number;
  encrypt?: boolean;
  version?: number;
  migrate?: (oldValue: unknown, oldVersion: number) => T;
}

/** Métadonnées de stockage */
interface StorageMetadata {
  version: number;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
}

/** Valeur stockée avec métadonnées */
interface StoredData<T> {
  value: T;
  metadata: StorageMetadata;
}

/** État du storage */
export interface StorageState<T> {
  value: T;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  version: number;
}

/** Résultat du hook */
export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => Promise<void>;
  remove: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  reset: () => Promise<void>;
}

const DEFAULT_CONFIG: StorageConfig<unknown> = {
  syncTabs: true,
  encrypt: true,
  version: 1
};

const STORAGE_PREFIX = 'emotionscare:';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  config?: StorageConfig<T>
): UseLocalStorageResult<T> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config } as StorageConfig<T>;
  const fullKey = `${STORAGE_PREFIX}${key}`;

  const [state, setState] = useState<StorageState<T>>({
    value: initialValue,
    isLoading: true,
    isStale: false,
    error: null,
    lastUpdated: null,
    version: mergedConfig.version || 1
  });

  const initialValueRef = useRef(initialValue);
  const isMountedRef = useRef(true);

  // Sérialisation personnalisée
  const serialize = useCallback((value: T): string => {
    if (mergedConfig.serialize) {
      return mergedConfig.serialize(value);
    }
    return JSON.stringify(value);
  }, [mergedConfig]);

  // Désérialisation personnalisée
  const deserialize = useCallback((raw: string): T => {
    if (mergedConfig.deserialize) {
      return mergedConfig.deserialize(raw);
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }, [mergedConfig]);

  // Valider la valeur
  const validate = useCallback((value: unknown): value is T => {
    if (mergedConfig.validator) {
      return mergedConfig.validator(value);
    }
    return true;
  }, [mergedConfig]);

  // Vérifier l'expiration
  const isExpired = useCallback((metadata: StorageMetadata): boolean => {
    if (!metadata.expiresAt) return false;
    return Date.now() > metadata.expiresAt;
  }, []);

  // Migrer les données si nécessaire
  const migrateIfNeeded = useCallback((
    storedData: StoredData<unknown>
  ): T => {
    const currentVersion = mergedConfig.version || 1;
    const storedVersion = storedData.metadata.version;

    if (storedVersion < currentVersion && mergedConfig.migrate) {
      try {
        return mergedConfig.migrate(storedData.value, storedVersion);
      } catch (err) {
        logger.warn(`[useLocalStorage] Migration failed for ${key}`, err as Error, 'SYSTEM');
        return initialValueRef.current;
      }
    }

    return storedData.value as T;
  }, [key, mergedConfig]);

  // Charger la valeur
  const loadValue = useCallback(async (): Promise<T | null> => {
    try {
      let raw: StoredData<T> | null = null;

      if (mergedConfig.encrypt) {
        raw = await getSecureItem<StoredData<T>>(fullKey);
      } else {
        const stored = localStorage.getItem(fullKey);
        if (stored) {
          raw = JSON.parse(stored) as StoredData<T>;
        }
      }

      if (!raw) return null;

      // Vérifier l'expiration
      if (isExpired(raw.metadata)) {
        logger.info(`[useLocalStorage] Item expired: ${key}`, {}, 'SYSTEM');
        await removeItem();
        return null;
      }

      // Migrer si nécessaire
      const migratedValue = migrateIfNeeded(raw);

      // Valider
      if (!validate(migratedValue)) {
        logger.warn(`[useLocalStorage] Validation failed for ${key}`, {}, 'SYSTEM');
        return null;
      }

      return migratedValue;
    } catch (error) {
      logger.warn(`[useLocalStorage] Failed to load ${key}`, error as Error, 'SYSTEM');
      mergedConfig.onError?.(error as Error);
      return null;
    }
  }, [fullKey, key, mergedConfig, isExpired, migrateIfNeeded, validate]);

  // Sauvegarder la valeur
  const saveValue = useCallback(async (value: T): Promise<void> => {
    try {
      const now = Date.now();
      const data: StoredData<T> = {
        value,
        metadata: {
          version: mergedConfig.version || 1,
          createdAt: state.lastUpdated?.getTime() || now,
          updatedAt: now,
          expiresAt: mergedConfig.expiration ? now + mergedConfig.expiration : undefined
        }
      };

      if (mergedConfig.encrypt) {
        await setSecureItem(fullKey, data);
      } else {
        localStorage.setItem(fullKey, JSON.stringify(data));
      }

      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          value,
          lastUpdated: new Date(now),
          error: null,
          isStale: false
        }));
      }
    } catch (error) {
      logger.error(`[useLocalStorage] Failed to save ${key}`, error as Error, 'SYSTEM');
      mergedConfig.onError?.(error as Error);

      if (isMountedRef.current) {
        setState(prev => ({ ...prev, error: error as Error }));
      }
      throw error;
    }
  }, [fullKey, key, mergedConfig, state.lastUpdated]);

  // Supprimer la valeur
  const removeItem = useCallback(async (): Promise<void> => {
    try {
      if (mergedConfig.encrypt) {
        await removeSecureItem(fullKey);
      } else {
        localStorage.removeItem(fullKey);
      }

      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          value: initialValueRef.current,
          lastUpdated: null,
          error: null
        }));
      }
    } catch (error) {
      logger.error(`[useLocalStorage] Failed to remove ${key}`, error as Error, 'SYSTEM');
      throw error;
    }
  }, [fullKey, key, mergedConfig.encrypt]);

  // Setter public
  const setValue = useCallback(async (value: T | ((prev: T) => T)): Promise<void> => {
    const valueToStore = value instanceof Function ? value(state.value) : value;
    await saveValue(valueToStore);
  }, [state.value, saveValue]);

  // Rafraîchir depuis le storage
  const refresh = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    const loaded = await loadValue();

    if (isMountedRef.current) {
      setState(prev => ({
        ...prev,
        value: loaded ?? initialValueRef.current,
        isLoading: false,
        isStale: false,
        lastUpdated: loaded ? new Date() : prev.lastUpdated
      }));
    }
  }, [loadValue]);

  // Réinitialiser à la valeur initiale
  const reset = useCallback(async (): Promise<void> => {
    await saveValue(initialValueRef.current);
  }, [saveValue]);

  // Chargement initial
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const loaded = await loadValue();

      if (!cancelled && isMountedRef.current) {
        setState(prev => ({
          ...prev,
          value: loaded ?? initialValueRef.current,
          isLoading: false,
          lastUpdated: loaded ? new Date() : null
        }));
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [fullKey]);

  // Synchronisation entre onglets
  useEffect(() => {
    if (!mergedConfig.syncTabs) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== fullKey) return;

      if (event.newValue === null) {
        // Supprimé dans un autre onglet
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            value: initialValueRef.current,
            isStale: true
          }));
        }
      } else {
        // Mis à jour dans un autre onglet
        try {
          const data = JSON.parse(event.newValue) as StoredData<T>;
          if (validate(data.value) && isMountedRef.current) {
            setState(prev => ({
              ...prev,
              value: data.value,
              lastUpdated: new Date(data.metadata.updatedAt),
              isStale: false
            }));
          }
        } catch {
          // Ignorer les erreurs de parsing
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fullKey, mergedConfig.syncTabs, validate]);

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    value: state.value,
    setValue,
    remove: removeItem,
    refresh,
    isLoading: state.isLoading,
    isStale: state.isStale,
    error: state.error,
    lastUpdated: state.lastUpdated,
    reset
  };
}

/** Hook simplifié pour valeurs primitives */
export function useLocalStorageString(key: string, initialValue: string = '') {
  return useLocalStorage(key, initialValue, { encrypt: false });
}

export function useLocalStorageNumber(key: string, initialValue: number = 0) {
  return useLocalStorage(key, initialValue, { encrypt: false });
}

export function useLocalStorageBoolean(key: string, initialValue: boolean = false) {
  return useLocalStorage(key, initialValue, { encrypt: false });
}

/** Hook pour valeurs avec expiration */
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  expirationMs: number
) {
  return useLocalStorage(key, initialValue, {
    expiration: expirationMs,
    encrypt: true
  });
}

/** Hook pour objets avec validation de schéma */
export function useLocalStorageObject<T extends object>(
  key: string,
  initialValue: T,
  validator?: (value: unknown) => value is T
) {
  return useLocalStorage(key, initialValue, {
    validator,
    encrypt: true
  });
}

/** Hook pour tableaux */
export function useLocalStorageArray<T>(key: string, initialValue: T[] = []) {
  const result = useLocalStorage<T[]>(key, initialValue, { encrypt: true });

  const push = useCallback(async (item: T) => {
    await result.setValue(prev => [...prev, item]);
  }, [result]);

  const pop = useCallback(async () => {
    let removed: T | undefined;
    await result.setValue(prev => {
      removed = prev[prev.length - 1];
      return prev.slice(0, -1);
    });
    return removed;
  }, [result]);

  const removeAt = useCallback(async (index: number) => {
    await result.setValue(prev => prev.filter((_, i) => i !== index));
  }, [result]);

  const updateAt = useCallback(async (index: number, item: T) => {
    await result.setValue(prev => prev.map((v, i) => i === index ? item : v));
  }, [result]);

  const clear = useCallback(async () => {
    await result.setValue([]);
  }, [result]);

  return {
    ...result,
    push,
    pop,
    removeAt,
    updateAt,
    clear,
    length: result.value.length,
    isEmpty: result.value.length === 0
  };
}

/** Hook pour Map */
export function useLocalStorageMap<K extends string, V>(
  key: string,
  initialValue: Map<K, V> = new Map()
) {
  const result = useLocalStorage<[K, V][]>(
    key,
    Array.from(initialValue.entries()),
    {
      encrypt: true,
      serialize: (value) => JSON.stringify(value),
      deserialize: (raw) => JSON.parse(raw) as [K, V][]
    }
  );

  const map = useMemo(() => new Map(result.value), [result.value]);

  const set = useCallback(async (k: K, v: V) => {
    const newMap = new Map(map);
    newMap.set(k, v);
    await result.setValue(Array.from(newMap.entries()));
  }, [map, result]);

  const remove = useCallback(async (k: K) => {
    const newMap = new Map(map);
    newMap.delete(k);
    await result.setValue(Array.from(newMap.entries()));
  }, [map, result]);

  const get = useCallback((k: K): V | undefined => {
    return map.get(k);
  }, [map]);

  const has = useCallback((k: K): boolean => {
    return map.has(k);
  }, [map]);

  const clear = useCallback(async () => {
    await result.setValue([]);
  }, [result]);

  return {
    ...result,
    value: map,
    set,
    get,
    has,
    delete: remove,
    clear,
    size: map.size,
    keys: () => map.keys(),
    values: () => map.values(),
    entries: () => map.entries()
  };
}

/** Hook pour Set */
export function useLocalStorageSet<T>(
  key: string,
  initialValue: Set<T> = new Set()
) {
  const result = useLocalStorage<T[]>(
    key,
    Array.from(initialValue),
    { encrypt: true }
  );

  const set = useMemo(() => new Set(result.value), [result.value]);

  const add = useCallback(async (item: T) => {
    const newSet = new Set(set);
    newSet.add(item);
    await result.setValue(Array.from(newSet));
  }, [set, result]);

  const remove = useCallback(async (item: T) => {
    const newSet = new Set(set);
    newSet.delete(item);
    await result.setValue(Array.from(newSet));
  }, [set, result]);

  const toggle = useCallback(async (item: T) => {
    if (set.has(item)) {
      await remove(item);
    } else {
      await add(item);
    }
  }, [set, add, remove]);

  const has = useCallback((item: T): boolean => {
    return set.has(item);
  }, [set]);

  const clear = useCallback(async () => {
    await result.setValue([]);
  }, [result]);

  return {
    ...result,
    value: set,
    add,
    delete: remove,
    toggle,
    has,
    clear,
    size: set.size
  };
}

export default useLocalStorage;
