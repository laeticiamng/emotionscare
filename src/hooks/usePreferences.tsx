
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences, UserPreferencesState } from '@/types';

export const usePreferences = (): UserPreferencesState => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get preferences from user or set defaults
  const defaultPreferences: UserPreferences = {
    theme: 'light',
    fontSize: 'medium',
    language: 'fr',
    notifications: true,
    autoplayVideos: true,
    showEmotionPrompts: true,
    privacyLevel: 'medium',
    dataCollection: true,
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
    emotionalCamouflage: false,
    aiSuggestions: false,
    fullAnonymity: false
  };

  const preferences = user?.preferences || defaultPreferences;

  const updatePreferences = useCallback(async (newPrefs: Partial<UserPreferences>): Promise<boolean> => {
    if (!user) return false;
    
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
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      console.error('Error updating preferences:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, preferences, updateUser]);

  const resetPreferences = useCallback(() => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      updatePreferences(defaultPreferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset preferences');
      console.error('Error resetting preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, updatePreferences, defaultPreferences]);

  // Derive legacy properties for backward compatibility
  const theme = preferences.theme;
  const fontSize = preferences.fontSize;
  const notifications_enabled = preferences.notifications_enabled || preferences.notifications;
  const notification_frequency = preferences.notification_frequency || preferences.notificationFrequency;
  const notification_type = preferences.notification_type || preferences.notificationType;
  const notification_tone = preferences.notification_tone || preferences.notificationTone;
  const email_notifications = preferences.email_notifications;
  const push_notifications = preferences.push_notifications;
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
};

export default usePreferences;
