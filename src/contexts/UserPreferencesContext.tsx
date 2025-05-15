
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserPreferences } from '@/types/user';

// Define the context type
export interface UserPreferencesContextType {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  loading: boolean;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'system',
  language: 'fr',
  ambientSound: false,
  notifications: {
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    frequency: 'daily',
    types: {
      system: true,
      emotion: true,
      coach: true,
      journal: true,
      community: true,
    },
    tone: 'friendly',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  }
};

// Create context with default values
export const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  setPreferences: () => {},
  updatePreferences: () => {},
  resetPreferences: () => {},
  loading: false,
});

// Custom hook to use the UserPreferences context
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  
  return context;
};

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  // Load preferences from local storage on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPrefs = localStorage.getItem('userPreferences');
        if (storedPrefs) {
          setPreferences(JSON.parse(storedPrefs));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences, loading]);

  // Function to update specific preferences
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  // Function to reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setPreferences,
        updatePreferences,
        resetPreferences,
        loading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
