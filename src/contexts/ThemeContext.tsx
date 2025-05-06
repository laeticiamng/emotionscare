import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeName, themes } from '@/themes/theme';

type ThemePreference = ThemeName | 'system';

interface ThemeContextType {
  theme: ThemeName;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
  setThemePreference: (preference: ThemePreference) => void;
  isDark: boolean;
  isPastel: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem('themePreference');
    if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'pastel' || storedTheme === 'system') {
      return storedTheme as ThemePreference;
    }
    // Default to system
    return 'system';
  });
  
  const [theme, setTheme] = useState<ThemeName>(() => {
    // If preference is system, use browser preference
    if (themePreference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // Otherwise use the explicit preference
    return themePreference as ThemeName;
  });

  // Listen for changes in system theme if preference is 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (themePreference === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themePreference]);

  // Update the theme when preference changes
  useEffect(() => {
    if (themePreference === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(themePreference as ThemeName);
    }
    
    // Store the preference
    localStorage.setItem('themePreference', themePreference);
  }, [themePreference]);

  useEffect(() => {
    // Remove previous theme classes
    document.documentElement.classList.remove('dark', 'light', 'pastel');
    
    // Add the new theme class
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemePreference(prevTheme => {
      if (prevTheme === 'system') {
        return theme === 'dark' ? 'light' : theme === 'light' ? 'pastel' : 'dark';
      } else {
        return prevTheme === 'dark' ? 'light' : prevTheme === 'light' ? 'pastel' : 'dark';
      }
    });
  };

  const isDark = theme === 'dark';
  const isPastel = theme === 'pastel';

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themePreference,
      toggleTheme, 
      setTheme, 
      setThemePreference,
      isDark,
      isPastel
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
