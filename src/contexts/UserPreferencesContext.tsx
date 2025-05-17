
import React, { createContext, useContext, useState } from 'react';
import { ThemeName } from '@/types/theme';

interface UserPreferencesContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  colorBlindMode: boolean;
  setColorBlindMode: (mode: boolean) => void;
  // Add more preferences as needed
}

const defaultPreferences: UserPreferencesContextType = {
  theme: 'light',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  reduceMotion: false,
  setReduceMotion: () => {},
  colorBlindMode: false,
  setColorBlindMode: () => {},
};

const UserPreferencesContext = createContext<UserPreferencesContextType>(defaultPreferences);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('light');
  const [fontSize, setFontSize] = useState('medium');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);

  return (
    <UserPreferencesContext.Provider value={{
      theme,
      setTheme,
      fontSize,
      setFontSize,
      reduceMotion,
      setReduceMotion,
      colorBlindMode,
      setColorBlindMode
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
