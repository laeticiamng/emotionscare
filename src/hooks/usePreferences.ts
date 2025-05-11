
import { useState, useCallback } from 'react';
import { UserPreferences } from '@/types/user';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    fontSize: 'medium',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    autoplayVideos: true,
    showEmotionPrompts: true,
    privacy: 'private',
    dataCollection: true,
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
    emotionalCamouflage: false,
    aiSuggestions: false,
    fullAnonymity: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      setPreferences((prev) => ({ 
        ...prev, 
        ...newPreferences,
        // Ensure nested structures are handled correctly
        ...(newPreferences.notifications 
          ? { notifications: { ...prev.notifications, ...newPreferences.notifications } } 
          : {})
      }));
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
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      autoplayVideos: true,
      showEmotionPrompts: true,
      privacy: 'private',
      dataCollection: true,
      notifications_enabled: true,
      email_notifications: true,
      push_notifications: true,
      emotionalCamouflage: false,
      aiSuggestions: false,
      fullAnonymity: false
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
    fontSize: preferences.fontSize || 'medium',
    notifications_enabled: preferences.notifications_enabled,
    notification_frequency: preferences.notification_frequency,
    notification_tone: preferences.notification_tone,
    notification_type: preferences.notification_type,
    email_notifications: preferences.email_notifications,
    push_notifications: preferences.push_notifications,
    emotionalCamouflage: preferences.emotionalCamouflage
  };
};

export default usePreferences;
