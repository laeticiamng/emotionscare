
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEFAULT_USER_PREFERENCES } from '@/constants/defaults';

interface UserPreferencesContextType {
  preferences: {
    theme: string;
    fontSize: string;
    language: string;
    ambientSound?: boolean;
    notifications: {
      enabled: boolean;
      emailEnabled: boolean;
      pushEnabled: boolean;
      frequency: string;
      types: Record<string, boolean>;
      tone: string;
      quietHours: {
        enabled: boolean;
        start: string;
        end: string;
      };
    };
  };
  updatePreferences: (newPreferences: Partial<UserPreferencesContextType['preferences']>) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState(DEFAULT_USER_PREFERENCES);

  useEffect(() => {
    // Load preferences from localStorage if available
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<typeof preferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
