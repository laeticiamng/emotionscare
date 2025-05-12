
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types';

export const usePreferences = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'fr',
    fontSize: 'medium',
    fontFamily: 'inter',
    notifications: false,
    soundEnabled: true,
    privacyLevel: 'private',
    onboardingCompleted: false,
    dashboardLayout: 'standard'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
    setIsLoading(false);
  }, [user]);

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    try {
      if (!user) return;

      const updatedPreferences = {
        ...preferences,
        ...newPreferences,
      };

      await updateUser({
        ...user,
        preferences: updatedPreferences,
      });

      setPreferences(updatedPreferences);
      return updatedPreferences;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [preferences, user, updateUser]);

  return {
    preferences,
    isLoading,
    updatePreferences,
  };
};
