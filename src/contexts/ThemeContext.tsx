
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system' | 'pastel';
type FontSize = 'small' | 'medium' | 'large' | 'x-large';
type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  // Add missing properties
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
}

const initialState: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
  isDarkMode: false,
  fontSize: 'medium',
  setFontSize: () => null,
  fontFamily: 'system',
  setFontFamily: () => null
};

export const ThemeContext = createContext<ThemeContextType>(initialState);

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    return storedTheme || 'system';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('fontSize') as FontSize) || 'medium';
  });
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('fontFamily') as FontFamily) || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.remove('light', 'dark', 'pastel');
    root.classList.add(currentTheme);
    
    setIsDarkMode(currentTheme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    document.documentElement.dataset.fontFamily = fontFamily;
  }, [fontFamily]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDarkMode,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
