import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContextType, Theme, FontSize, FontFamily } from '@/types/theme';

const defaultThemeContext: ThemeContextType = {
  theme: 'system',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
  isDarkMode: false,
  fontSize: 'md',
  setFontSize: () => {},
  fontFamily: 'sans',
  setFontFamily: () => {},
  systemTheme: 'light',
  soundEnabled: false,
  reduceMotion: false,
  setSoundEnabled: () => {},
  setReduceMotion: () => {}
};

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Compute isDark and isDarkMode
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const isDark = isDarkMode; // Alias

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      root.classList.remove('dark', 'light', 'pastel');
      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === 'dark');
    } else {
      root.classList.remove('dark', 'light', 'pastel');
      root.classList.add(theme);
      setIsDarkMode(theme === 'dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Update font family
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all font classes and add the selected one
    root.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-rounded');
    root.classList.add(`font-${fontFamily}`);
    
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);
  
  // Update font size
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all size classes and add the selected one
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    if (fontSize === 'sm' || fontSize === 'xs') root.classList.add('text-sm');
    if (fontSize === 'lg' || fontSize === 'xl') root.classList.add('text-lg');
    // Medium is the default, no class needed
    
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isDarkMode,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    systemTheme,
    soundEnabled,
    reduceMotion,
    setSoundEnabled,
    setReduceMotion
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
