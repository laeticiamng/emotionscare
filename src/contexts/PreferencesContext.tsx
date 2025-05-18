
import React, { createContext, useContext, useState } from 'react';
import { UserPreferences, UserPreferencesContextType, DEFAULT_PREFERENCES, NotificationsPreferences } from '@/types/preferences';

// Create the context
const PreferencesContext = createContext<UserPreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  theme: DEFAULT_PREFERENCES.theme || 'system',
  fontSize: DEFAULT_PREFERENCES.fontSize || 'medium',
  language: DEFAULT_PREFERENCES.language || 'fr',
  notifications: DEFAULT_PREFERENCES.notifications as NotificationsPreferences,
  privacy: DEFAULT_PREFERENCES.privacy || 'private',
  updatePreferences: async () => {},
  resetPreferences: () => {},
  isLoading: false,
  error: null,
});

// Provider component
export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Extract main properties for context
  const theme = preferences.theme || 'system';
  const fontSize = preferences.fontSize || 'medium';
  const language = preferences.language || 'fr';
  
  // Normalize notifications
  const notifications: NotificationsPreferences = typeof preferences.notifications === 'boolean'
    ? { enabled: preferences.notifications, emailEnabled: false, pushEnabled: false }
    : preferences.notifications || { enabled: true, emailEnabled: true, pushEnabled: false };
  
  // Normalize privacy preferences
  const privacy = preferences.privacy || 'private';

  // Function to update preferences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Implement the actual update logic here (e.g., API call to update user preferences)
      // For now, we'll just update the local state
      setPreferences({ ...preferences, ...newPreferences });
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset preferences
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const value: UserPreferencesContextType = {
    preferences,
    theme,
    fontSize,
    language,
    notifications,
    privacy,
    updatePreferences,
    resetPreferences,
    isLoading,
    error,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Hook to use the preferences context
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export default PreferencesContext;
