
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeName, FontSize, FontFamily, ThemeContextType } from '@/types/types';

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system-ui');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    
    // Check if dark mode is active
    const isDark = storedTheme === 'dark' || 
      (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
    
    // Update isDarkMode when theme changes
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
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
      case 'extra-large':
        return '1.25rem';
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
    isDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create context once
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  fontFamily: 'system-ui',
  setFontFamily: () => {},
  isDarkMode: false
});

// Custom hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
