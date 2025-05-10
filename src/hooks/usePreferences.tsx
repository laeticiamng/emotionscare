
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences, UserPreferencesState } from '@/types';

export function usePreferences(): UserPreferencesState {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get preferences from user or set defaults
  const defaultPreferences: UserPreferences = {
    theme: 'light',
    notifications: {
      email: false,
      push: false
    },
    language: 'fr',
    fontSize: 'medium',
    autoplayVideos: true,
    showEmotionPrompts: true,
    privacyLevel: 'medium',
    dataCollection: true
  };

  const preferences = user?.preferences || defaultPreferences;

  const updatePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedPreferences = {
        ...preferences,
        ...newPrefs
      };
      
      await updateUser({
        ...user,
        preferences: updatedPreferences
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      console.error('Error updating preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, preferences, updateUser]);

  const resetPreferences = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await updateUser({
        ...user,
        preferences: defaultPreferences
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset preferences');
      console.error('Error resetting preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser]);

  // Derive legacy properties for backward compatibility
  const theme = preferences.theme;
  const fontSize = preferences.fontSize || preferences.font_size;
  const notifications_enabled = preferences.notifications_enabled;
  const notification_frequency = preferences.notificationFrequency;
  const notification_type = preferences.notificationType;
  const notification_tone = preferences.notificationTone;
  const email_notifications = preferences.notifications?.email;
  const push_notifications = preferences.notifications?.push;
  const emotionalCamouflage = preferences.emotionalCamouflage;

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    resetPreferences,
    theme,
    fontSize,
    notifications_enabled,
    notification_frequency,
    notification_type,
    notification_tone,
    email_notifications,
    push_notifications,
    emotionalCamouflage
  };
}

export default usePreferences;
