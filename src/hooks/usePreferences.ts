
import { useState, useCallback } from 'react';
import { UserPreferences, UserPreferencesState } from '@/types';

export const usePreferences = (): UserPreferencesState => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    fontSize: 'medium',
    language: 'fr',
    notifications: true,
    autoplayVideos: true,
    showEmotionPrompts: true,
    privacyLevel: 'standard',
    dataCollection: true,
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    // Simulating an API call
    setTimeout(() => {
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    theme: preferences.theme,
    fontSize: preferences.fontSize,
    language: preferences.language,
    notifications: preferences.notifications,
    autoplayVideos: preferences.autoplayVideos,
    showEmotionPrompts: preferences.showEmotionPrompts,
    privacyLevel: preferences.privacyLevel,
    dataCollection: preferences.dataCollection,
    notifications_enabled: preferences.notifications_enabled,
    email_notifications: preferences.email_notifications,
    push_notifications: preferences.push_notifications,
  };
};

export default usePreferences;
