
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeName } from '@/types';

interface ThemeContextType {
  theme: ThemeName;
  toggleTheme: () => void;
  setThemePreference: (theme: ThemeName) => void;
  isDynamicTheme: boolean;
  setDynamicThemeMode: (mode: 'none' | 'time' | 'emotion' | 'weather') => void;
  dynamicThemeMode: 'none' | 'time' | 'emotion' | 'weather';
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
  const [isDynamicTheme, setIsDynamicTheme] = useState(false);
  const [dynamicThemeMode, setDynamicThemeMode] = useState<'none' | 'time' | 'emotion' | 'weather'>('none');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme') as ThemeName | null;
      const storedDynamicMode = localStorage.getItem('dynamicThemeMode') as 'none' | 'time' | 'emotion' | 'weather' | null;
      
      if (storedTheme && ['light', 'dark', 'system', 'pastel'].includes(storedTheme)) {
        setTheme(storedTheme);
        document.documentElement.classList.add(storedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
      
      if (storedDynamicMode && ['none', 'time', 'emotion', 'weather'].includes(storedDynamicMode)) {
        setDynamicThemeMode(storedDynamicMode);
        setIsDynamicTheme(storedDynamicMode !== 'none');
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  }, []);

  // Apply dynamic theme based on mode
  useEffect(() => {
    if (!isDynamicTheme) return;
    
    let newTheme: ThemeName = 'light';
    const hour = new Date().getHours();
    
    // Apply theme based on the dynamic mode
    switch (dynamicThemeMode) {
      case 'time':
        // Morning (6-12): Light theme
        // Afternoon (12-18): Light/Pastel
        // Evening (18-22): Pastel
        // Night (22-6): Dark
        if (hour >= 6 && hour < 12) {
          newTheme = 'light';
        } else if (hour >= 12 && hour < 18) {
          newTheme = 'light';
        } else if (hour >= 18 && hour < 22) {
          newTheme = 'pastel';
        } else {
          newTheme = 'dark';
        }
        break;
        
      case 'emotion':
        // This would use emotional data from elsewhere in the app
        // For now, we'll use a fallback
        newTheme = theme;
        break;
        
      case 'weather':
        // This would use weather API data
        // For now, we'll use a fallback
        newTheme = theme;
        break;
        
      default:
        newTheme = 'light';
    }
    
    // Only update if theme is different
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  }, [isDynamicTheme, dynamicThemeMode]);

  // Update HTML class and localStorage when theme changes
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'system', 'pastel');
    // Add current theme class
    document.documentElement.classList.add(theme);
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save dynamic theme preferences
  useEffect(() => {
    localStorage.setItem('dynamicThemeMode', dynamicThemeMode);
  }, [dynamicThemeMode]);

  const toggleTheme = () => {
    setTheme(currentTheme => {
      if (currentTheme === 'light') return 'dark';
      if (currentTheme === 'dark') return 'pastel';
      if (currentTheme === 'pastel') return 'light';
      return 'light';
    });
  };
  
  const setThemePreference = (newTheme: ThemeName) => {
    setTheme(newTheme);
    setIsDynamicTheme(false);
    setDynamicThemeMode('none');
  };
  
  const handleSetDynamicThemeMode = (mode: 'none' | 'time' | 'emotion' | 'weather') => {
    setDynamicThemeMode(mode);
    setIsDynamicTheme(mode !== 'none');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setThemePreference,
      isDynamicTheme,
      setDynamicThemeMode: handleSetDynamicThemeMode,
      dynamicThemeMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
