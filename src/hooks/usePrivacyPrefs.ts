// @ts-nocheck
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface PrivacyPrefs {
  camera: boolean;
  heartRate: boolean;
  analytics: boolean;
  personalization: boolean;
}

const DEFAULT_PREFS: PrivacyPrefs = {
  camera: true,
  heartRate: true,
  analytics: true,
  personalization: true,
};

const STORAGE_KEY = 'emotionscare_privacy_prefs';

export const usePrivacyPrefs = () => {
  const [prefs, setPrefs] = useState<PrivacyPrefs>(DEFAULT_PREFS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPrefs = JSON.parse(stored);
        setPrefs({ ...DEFAULT_PREFS, ...parsedPrefs });
      }
    } catch (error) {
      logger.warn('Failed to load privacy preferences', error as Error, 'SYSTEM');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage
  const updatePrefs = (newPrefs: Partial<PrivacyPrefs>) => {
    const updatedPrefs = { ...prefs, ...newPrefs };
    setPrefs(updatedPrefs);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrefs));
    } catch (error) {
      logger.warn('Failed to save privacy preferences', error as Error, 'SYSTEM');
    }
  };

  // Reset to defaults
  const resetPrefs = () => {
    setPrefs(DEFAULT_PREFS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      logger.warn('Failed to reset privacy preferences', error as Error, 'SYSTEM');
    }
  };

  return {
    prefs,
    updatePrefs,
    resetPrefs,
    isLoaded,
  };
};