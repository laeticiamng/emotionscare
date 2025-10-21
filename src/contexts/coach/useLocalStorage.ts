// @ts-nocheck

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

// Hook for persistent storage using localStorage
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none, return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      logger.error('Error reading from localStorage', error as Error, 'SYSTEM');
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function to get the previous value
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      logger.error('Error writing to localStorage', error as Error, 'SYSTEM');
    }
  };
  
  // Listen to storage events to ensure consistency across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      
      try {
        const newValue = e.newValue ? JSON.parse(e.newValue) as T : initialValue;
        setStoredValue(newValue);
      } catch (error) {
        logger.error('Error parsing localStorage change', error as Error, 'SYSTEM');
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
    
    return undefined;
  }, [initialValue, key]);
  
  return [storedValue, setValue];
}
