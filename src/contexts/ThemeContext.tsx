
import React, { createContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'inter' | 'poppins' | 'roboto' | 'mono';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  setThemePreference: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // Effect to load preferences from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const storedFontFamily = localStorage.getItem('fontFamily') as FontFamily | null;
    const storedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    if (storedFontFamily) {
      setFontFamily(storedFontFamily);
    }
    
    if (storedFontSize) {
      setFontSize(storedFontSize);
    }
  }, []);
  
  // Effect to apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'pastel');
    
    // Determine the theme to apply
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      root.classList.add(theme);
      setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
    }
    
    // Apply font family
    root.style.setProperty('--font-family', getFontFamilyValue(fontFamily));
    
    // Apply font size
    document.body.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (fontSize) {
      case 'small':
        document.body.classList.add('text-sm');
        break;
      case 'medium':
        document.body.classList.add('text-base');
        break;
      case 'large':
        document.body.classList.add('text-lg');
        break;
    }
    
    // Save preferences
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontSize', fontSize);
  }, [theme, fontFamily, fontSize]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newSystemTheme);
        setResolvedTheme(newSystemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
  };
  
  const getFontFamilyValue = (font: FontFamily): string => {
    switch (font) {
      case 'inter':
        return 'Inter, sans-serif';
      case 'poppins':
        return 'Poppins, sans-serif';
      case 'roboto':
        return 'Roboto, sans-serif';
      case 'mono':
        return 'monospace';
      default:
        return 'Inter, sans-serif';
    }
  };
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        resolvedTheme,
        setTheme,
        setThemePreference,
        fontFamily, 
        setFontFamily, 
        fontSize, 
        setFontSize 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
