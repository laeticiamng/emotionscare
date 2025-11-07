// @ts-nocheck
/**
 * useLocalStorage - Hook avec chiffrement automatique
 * Utilise secureStorage en interne pour protection RGPD Art. 32
 * Compatible drop-in avec l'ancienne API localStorage
 */

import { useState, useEffect } from 'react';
import { getSecureItem, setSecureItem } from '@/lib/secureStorage';
import { logger } from '@/lib/logger';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial depuis secure storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        const item = await getSecureItem<T>(key);
        if (item !== null) {
          setStoredValue(item);
        }
      } catch (error) {
        logger.warn(`[useLocalStorage] Failed to load ${key}`, error as Error, 'SYSTEM');
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]);

  // Setter avec chiffrement automatique
  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await setSecureItem(key, valueToStore);
    } catch (error) {
      logger.error(`[useLocalStorage] Failed to save ${key}`, error as Error, 'SYSTEM');
    }
  };

  return [storedValue, setValue, isLoading] as const;
}
