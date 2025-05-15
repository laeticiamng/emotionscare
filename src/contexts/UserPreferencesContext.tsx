
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserPreferences } from '@/types';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: {
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'default',
    language: 'en',
    notifications: false
  },
  updatePreferences: async () => {},
  isLoading: false,
  error: null
});

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    fontSize: 'medium',
    fontFamily: 'default',
    language: 'en',
    notifications: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load preferences from storage or API
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        // Mock loading preferences from storage
        const storedPrefs = localStorage.getItem('userPreferences');
        if (storedPrefs) {
          setPreferences(JSON.parse(storedPrefs));
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading preferences'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    setIsLoading(true);
    try {
      const updatedPrefs = { ...preferences, ...newPrefs };
      setPreferences(updatedPrefs);
      
      // Mock saving to storage/API
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err instanceof Error ? err : new Error('Unknown error updating preferences'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, isLoading, error }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
