
import React, { createContext, useState, useEffect, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded' | 'inter' | 'roboto' | 'poppins' | 'montserrat' | 'raleway' | 'default';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode?: boolean;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  setFontFamily?: (font: FontFamily) => void;
  setFontSize?: (size: FontSize) => void;
}

const defaultContext: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get stored theme from localStorage if available
    const storedTheme = localStorage.getItem(storageKey);
    return (storedTheme as Theme) || defaultTheme;
  });

  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('fontFamily') as FontFamily) || 'sans';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('fontSize') as FontSize) || 'medium';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark', 'pastel');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Store theme preference
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Store font preferences
  useEffect(() => {
    if (fontFamily) localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    if (fontSize) localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Calculate if current mode is dark
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const value = {
    theme,
    setTheme,
    isDarkMode,
    fontFamily,
    fontSize,
    setFontFamily,
    setFontSize,
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
