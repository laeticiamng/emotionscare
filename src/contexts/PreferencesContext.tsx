
import React, { createContext, useContext, useState } from 'react';
import { UserPreferences, UserPreferencesContextType, DEFAULT_PREFERENCES } from '@/types/preferences';

// Create the context
const PreferencesContext = createContext<UserPreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
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
