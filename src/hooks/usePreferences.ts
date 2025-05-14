
import { useState, useEffect } from 'react';
import { UserPreferences, ThemeName, FontSize, FontFamily } from '@/types/preferences';
import { useAuth } from '@/contexts/AuthContext';
import { DEFAULT_USER_PREFERENCES } from '@/constants/defaults';

export const usePreferences = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(user?.preferences || {
    ...DEFAULT_USER_PREFERENCES,
    notifications: { 
      enabled: false, 
      emailEnabled: false, 
      pushEnabled: false, 
      frequency: 'daily' 
    },
    theme: 'system' as ThemeName,
    fontSize: 'medium' as FontSize,
    fontFamily: 'system' as FontFamily,
    language: 'fr',
    autoplayVideos: false,
    dataCollection: true,
    accessibilityFeatures: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    },
    dashboardLayout: 'standard',
    onboardingCompleted: false,
    privacyLevel: 'balanced'
  });
  
  // Sync preferences when user changes
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);
  
  const updatePreference = async <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ): Promise<void> => {
    if (!user) return;
    
    const updatedPreferences = {
      ...preferences,
      [key]: value
    };
    
    setPreferences(updatedPreferences);
    
    await updateUser({
      ...user,
      preferences: updatedPreferences
    });
  };
  
  const updatePreferences = async (newPreferences: Partial<UserPreferences>): Promise<void> => {
    if (!user) return;
    
    const updatedPreferences: UserPreferences = {
      ...preferences,
      ...newPreferences,
      theme: (newPreferences.theme as ThemeName) || preferences.theme,
      fontSize: (newPreferences.fontSize as FontSize) || preferences.fontSize,
      fontFamily: (newPreferences.fontFamily as FontFamily) || preferences.fontFamily,
      language: newPreferences.language || preferences.language
    };
    
    setPreferences(updatedPreferences);
    
    await updateUser({
      ...user,
      preferences: updatedPreferences
    });
  };
  
  return {
    preferences,
    updatePreference,
    updatePreferences,
    isLoading: !user
  };
};

export default usePreferences;
