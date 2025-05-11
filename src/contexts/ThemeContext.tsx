
import React, { createContext, useContext, useState } from 'react';
import { Theme } from '@/types/preferences';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemePreference: (theme: Theme) => void; // Added missing method
  toggleTheme: () => void; // Added missing method
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  setThemePreference: () => {}, // Added implementation
  toggleTheme: () => {}, // Added implementation
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Added missing method for backward compatibility
  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Added missing method for toggling theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setThemePreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
