
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, UserPreferencesContextType, DEFAULT_PREFERENCES } from '@/types/preferences';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [storedPreferences, setStoredPreferences] = useLocalStorage<UserPreferences>('user-preferences', DEFAULT_PREFERENCES);
  const [preferences, setPreferences] = useState<UserPreferences>(storedPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sync with localStorage when preferences change
  useEffect(() => {
    setStoredPreferences(preferences);
  }, [preferences, setStoredPreferences]);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      
      // Sync with Supabase when user is authenticated
      if (preferences.userId) {
        console.log('Syncing preferences with Supabase for user:', preferences.userId);
        // API call will be implemented when backend is ready
      }
      console.log('Preferences updated:', updated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setStoredPreferences(DEFAULT_PREFERENCES);
  };

  const value: UserPreferencesContextType = {
    preferences,
    theme: preferences.theme || 'system',
    fontSize: preferences.fontSize || 'medium',
    language: preferences.language || 'fr',
    notifications: preferences.notifications || DEFAULT_PREFERENCES.notifications!,
    privacy: preferences.privacy || 'private',
    updatePreferences,
    resetPreferences,
    isLoading,
    error,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
