
import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/user';

interface UsePreferencesReturn {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
}

export const usePreferences = (): UsePreferencesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'inter',
    notifications: {
      enabled: false,
      emailEnabled: false,
      pushEnabled: false,
      frequency: 'daily'
    }
  });

  useEffect(() => {
    // Load preferences from storage or API
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      // In a real app, we'd load from an API or local storage
      // For now, we'll just simulate loading with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
      
    } catch (err) {
      setError('Failed to load preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Merge new preferences with existing ones
      const updatedPreferences = {
        ...preferences,
        ...newPreferences,
        // If updating notifications, make sure we properly merge the nested object
        notifications: newPreferences.notifications 
          ? {
              ...preferences.notifications,
              ...newPreferences.notifications
            }
          : preferences.notifications
      };
      
      // In a real app, we'd save to an API
      // For now, we'll just simulate saving with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to local storage for demo purposes
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      
      // Update local state
      setPreferences(updatedPreferences);
    } catch (err) {
      setError('Failed to update preferences');
      console.error('Error updating preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    preferences,
    isLoading,
    error,
    updatePreferences
  };
};

export default usePreferences;
