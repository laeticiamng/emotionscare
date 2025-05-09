
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeName } from '@/types';

interface ThemeContextType {
  theme: ThemeName;
  toggleTheme: () => void;
  setThemePreference: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('light');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeName | null;
    if (storedTheme && ['light', 'dark', 'pastel'].includes(storedTheme)) {
      setTheme(storedTheme as ThemeName);
      document.documentElement.classList.add(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update HTML class and localStorage when theme changes
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'pastel');
    // Add current theme class
    document.documentElement.classList.add(theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => {
      switch (currentTheme) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'pastel';
        case 'pastel':
          return 'light';
        default:
          return 'light';
      }
    });
  };
  
  const setThemePreference = (newTheme: ThemeName) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
};
