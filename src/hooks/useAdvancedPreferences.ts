
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface AdvancedPreferences {
  performanceMode: 'high' | 'balanced' | 'battery';
  animations: boolean;
  soundEffects: boolean;
  notifications: boolean;
  analytics: boolean;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
}

const defaultPreferences: AdvancedPreferences = {
  performanceMode: 'balanced',
  animations: true,
  soundEffects: true,
  notifications: true,
  analytics: false,
  autoSave: true,
  theme: 'system',
  language: 'fr',
};

export const useAdvancedPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage<AdvancedPreferences>(
    'advanced-preferences',
    defaultPreferences
  );
  const [isLoading, setIsLoading] = useState(false);

  const updatePreference = useCallback(<K extends keyof AdvancedPreferences>(
    key: K,
    value: AdvancedPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences]);

  const exportPreferences = useCallback(() => {
    return JSON.stringify(preferences, null, 2);
  }, [preferences]);

  const importPreferences = useCallback((data: string) => {
    try {
      const imported = JSON.parse(data) as AdvancedPreferences;
      setPreferences({ ...defaultPreferences, ...imported });
      return true;
    } catch {
      return false;
    }
  }, [setPreferences]);

  // Appliquer les préférences au DOM
  useEffect(() => {
    if (preferences.animations) {
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }

    if (preferences.performanceMode === 'high') {
      document.documentElement.classList.add('performance-mode');
    } else {
      document.documentElement.classList.remove('performance-mode');
    }
  }, [preferences.animations, preferences.performanceMode]);

  return {
    preferences,
    isLoading,
    updatePreference,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };
};

export default useAdvancedPreferences;
