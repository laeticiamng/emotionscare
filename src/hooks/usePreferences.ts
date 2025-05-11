
import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, ThemeName, FontFamily, FontSize, NotificationFrequency, NotificationTone } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  language: 'fr',
  privacy: 'private',
  fontSize: 'medium',
  email_notifications: true,
  push_notifications: true,
  notifications_enabled: true,
  autoplayVideos: true,
  dataCollection: true,
  showEmotionPrompts: true,
  notification_frequency: 'medium',
  notification_type: 'email',
  notification_tone: 'friendly',
  emotionalCamouflage: false,
};

export const usePreferences = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(user?.preferences || defaultPreferences);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    } else {
      setPreferences(defaultPreferences);
    }
  }, [user?.preferences]);
  
  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    const currentPreferences = user.preferences || {};
    
    // Fixed spread operation
    const updatedPreferences = {
      ...currentPreferences,
      ...newPreferences
    } as UserPreferences;
    
    try {
      await updateUser({
        ...user,
        preferences: updatedPreferences
      });
      
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser]);
  
  const setTheme = (theme: ThemeName) => {
    updatePreferences({ theme });
  };
  
  const setFontSize = (fontSize: FontSize) => {
    updatePreferences({ fontSize });
  };
  
  const setFontFamily = (fontFamily: FontFamily) => {
    updatePreferences({ fontFamily });
  };
  
  const setNotificationFrequency = (notification_frequency: NotificationFrequency) => {
    updatePreferences({ notification_frequency });
  };
  
  const setNotificationTone = (notification_tone: NotificationTone) => {
    updatePreferences({ notification_tone });
  };
  
  return {
    preferences,
    isLoading,
    setTheme,
    setFontSize,
    setFontFamily,
    setNotificationFrequency,
    setNotificationTone,
    updatePreferences
  };
};
