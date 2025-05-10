
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
  const [error, setError] = useState<Error | null>(null);

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
      setIsLoading(false);
    }, 500);
    return Promise.resolve();
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
    notificationsEnabled: preferences.notifications_enabled,
    notifications_enabled: preferences.notifications_enabled,
    email_notifications: preferences.email_notifications,
    push_notifications: preferences.push_notifications,
    error,
    emotionalCamouflage: false,
    notificationFrequency: 'daily',
    notificationTone: 'gentle',
    notificationType: 'all',
    reminderTime: '09:00',
    reminder_time: '09:00'
  };
};

export default usePreferences;
