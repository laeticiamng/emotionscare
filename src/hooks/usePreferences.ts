
import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/user';
import { DEFAULT_PREFERENCES } from '@/types/preferences';

interface UsePreferencesOptions {
  defaultPreferences?: UserPreferences;
  saveToStorage?: boolean;
  storageKey?: string;
  onPreferenceChange?: (preferences: UserPreferences) => void;
}

export const usePreferences = (options: UsePreferencesOptions = {}) => {
  const {
    defaultPreferences = DEFAULT_PREFERENCES,
    saveToStorage = true,
    storageKey = 'user_preferences',
    onPreferenceChange
  } = options;

  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load preferences from storage (if enabled)
  useEffect(() => {
    if (saveToStorage) {
      try {
        const savedPrefs = localStorage.getItem(storageKey);
        if (savedPrefs) {
          const parsed = JSON.parse(savedPrefs);
          setPreferences({ ...defaultPreferences, ...parsed });
        }
      } catch (error) {
        console.error('Error loading preferences from storage:', error);
      }
    }
    setIsLoading(false);
  }, [saveToStorage, storageKey, defaultPreferences]);

  // Update preferences
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    if (saveToStorage) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving preferences to storage:', error);
      }
    }
    
    if (onPreferenceChange) {
      onPreferenceChange(updated);
    }
  };

  // Reset preferences to default
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    
    if (saveToStorage) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(defaultPreferences));
      } catch (error) {
        console.error('Error resetting preferences in storage:', error);
      }
    }
    
    if (onPreferenceChange) {
      onPreferenceChange(defaultPreferences);
    }
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoading
  };
};

export default usePreferences;
