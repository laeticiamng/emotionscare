
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
    notificationsEnabled: true,
    email_notifications: true,
    push_notifications: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences({
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
    setError(null);
  }, []);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    resetPreferences,
    theme: preferences.theme,
    fontSize: preferences.fontSize,
    language: preferences.language,
    notifications_enabled: preferences.notifications_enabled,
    notification_frequency: preferences.notification_frequency,
    notification_type: preferences.notification_type,
    notification_tone: preferences.notification_tone,
    email_notifications: preferences.email_notifications,
    push_notifications: preferences.push_notifications,
    emotionalCamouflage: preferences.emotionalCamouflage
  };
};

export default usePreferences;
