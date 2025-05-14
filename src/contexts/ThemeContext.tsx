import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeName, FontSize, FontFamily } from '@/types/user';

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

// Create the context with a default value
const defaultThemeContext: ThemeContextType = {
  theme: 'system',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  fontFamily: 'system-ui',
  setFontFamily: () => {},
};

// Create context once
export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system-ui');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeName || 'system';
    setTheme(storedTheme);
    document.documentElement.dataset.theme = storedTheme;

    const storedFontSize = localStorage.getItem('fontSize') as FontSize || 'medium';
    setFontSize(storedFontSize);
    document.documentElement.style.fontSize = getFontSizeValue(storedFontSize);

    const storedFontFamily = localStorage.getItem('fontFamily') as FontFamily || 'system-ui';
    setFontFamily(storedFontFamily);
    document.documentElement.style.fontFamily = getFontFamilyValue(storedFontFamily);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.style.fontSize = getFontSizeValue(fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    document.documentElement.style.fontFamily = getFontFamilyValue(fontFamily);
  }, [fontFamily]);

  const getFontSizeValue = (size: FontSize): string => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'medium':
        return '1rem';
      case 'large':
        return '1.125rem';
      default:
        return '1rem';
    }
  };

  const getFontFamilyValue = (font: FontFamily): string => {
    return font;
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
