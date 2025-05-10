
import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, UserPreferencesState } from '@/types/user';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  language: 'fr',
  fontSize: 'medium',
  autoplayVideos: true,
  showEmotionPrompts: true,
  privacyLevel: 'standard',
  dataCollection: true
};

export function usePreferences(): UserPreferencesState {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load user preferences from storage/API
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        // Here you would fetch from API or localStorage
        const storedPrefs = localStorage.getItem('userPreferences');
        if (storedPrefs) {
          setPreferences(JSON.parse(storedPrefs));
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
        setError('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Update preferences
  const updatePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    setIsLoading(true);
    try {
      const updatedPrefs = { ...preferences, ...newPrefs };
      // Here you would save to API or localStorage
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      setPreferences(updatedPrefs);
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);
  
  // Reset to defaults
  const resetPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      // Here you would reset in API
      localStorage.removeItem('userPreferences');
      setPreferences(defaultPreferences);
    } catch (err) {
      console.error('Error resetting preferences:', err);
      setError('Failed to reset preferences');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Return expanded state with properties for backward compatibility
  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    resetPreferences,
    // Legacy properties for compatibility with older components
    theme: preferences.theme,
    fontSize: preferences.fontSize,
    notifications: preferences.notifications_enabled !== undefined ? preferences.notifications_enabled : true,
    emotionalCamouflage: false, // Default value for premium feature
    // Additional compatibility properties
    notifications_enabled: preferences.notifications_enabled,
    notification_frequency: preferences.reminder_time,
    notification_type: 'all',
    notification_tone: 'default',
    email_notifications: preferences.notifications.email,
    push_notifications: preferences.notifications.push
  };
}

export default usePreferences;
