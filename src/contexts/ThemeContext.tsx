
import React, { createContext, useContext, useState } from 'react';
import { ThemeName, FontSize, FontFamily } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  systemTheme: ThemeName;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('system');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [reduceMotion, setReduceMotion] = useState(false);

  const isDark = theme === 'dark';
  const systemTheme = theme === 'system' ? 'light' : theme;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isDarkMode: isDark,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    systemTheme,
    reduceMotion,
    setReduceMotion
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
