
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Theme, FontFamily, FontSize, ThemeContextType } from '@/types/theme';

// Default values
const defaultContext: ThemeContextType = { 
  theme: "system",
  setTheme: () => {},
  toggleTheme: () => {}, 
  isDark: false, 
  isDarkMode: false,
  fontSize: "medium", 
  setFontSize: () => {},
  fontFamily: "system", 
  setFontFamily: () => {},
  systemTheme: "light",
  preferences: {},
  updatePreferences: () => {}
};

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>(defaultContext);

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [fontFamily, setFontFamily] = useLocalStorage<FontFamily>('fontFamily', 'system');
  const [fontSize, setFontSize] = useLocalStorage<FontSize>('fontSize', 'medium');
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('soundEnabled', false);
  const [reduceMotion, setReduceMotion] = useLocalStorage<boolean>('reduceMotion', false);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [preferences, setPreferences] = useLocalStorage<any>('preferences', {});
  
  // Add useEffect to detect system theme preference
  useEffect(() => {
    // Check for system dark mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  };

  const getContrastText = (color: string) => {
    // Remove the '#' symbol if it exists
    const hex = color.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate the perceived brightness (Luma)
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // Determine whether to use dark or light text
    return luma > 128 ? 'black' : 'white';
  };

  // Function to update preferences
  const updatePreferences = (newPrefs: any) => {
    setPreferences((prevPrefs: any) => ({
      ...prevPrefs,
      ...newPrefs
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDarkMode, 
      isDark, 
      fontFamily, 
      setFontFamily, 
      fontSize, 
      setFontSize,
      toggleTheme,
      getContrastText,
      systemTheme,
      soundEnabled,
      setSoundEnabled,
      reduceMotion,
      setReduceMotion,
      preferences,
      updatePreferences
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
