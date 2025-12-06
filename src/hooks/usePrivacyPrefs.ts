import { useState, useEffect } from 'react';

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
      console.warn('Failed to load privacy preferences:', error);
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
      console.warn('Failed to save privacy preferences:', error);
    }
  };

  // Reset to defaults
  const resetPrefs = () => {
    setPrefs(DEFAULT_PREFS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset privacy preferences:', error);
    }
  };

  return {
    prefs,
    updatePrefs,
    resetPrefs,
    isLoaded,
  };
};