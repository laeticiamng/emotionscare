
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theme, FontFamily, FontSize, ThemeContextType } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
  isDarkMode: false,
  fontSize: 'md',
  setFontSize: () => {},
  systemTheme: 'light'
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme || 'system';
    }
    return 'system';
  });
  
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    if (typeof window !== 'undefined') {
      const storedFont = localStorage.getItem('fontFamily') as FontFamily;
      return storedFont || 'sans';
    }
    return 'sans';
  });
  
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window !== 'undefined') {
      const storedSize = localStorage.getItem('fontSize') as FontSize;
      return storedSize || 'md';
    }
    return 'md';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [preferences, setPreferences] = useState({
    reduceMotion: false,
    soundEnabled: true
  });

  // Update the theme when the state changes
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

  // Helper for toggling between themes
  const toggleTheme = () => {
    const currentIsDark = theme === 'dark' || (theme === 'system' && isDarkMode);
    setTheme(currentIsDark ? 'light' : 'dark');
  };

  const getContrastText = (color: string): 'black' | 'white' => {
    // Simple contrast calculation
    let r = 0, g = 0, b = 0;
    
    if (color.startsWith('#')) {
      if (color.length === 4) {
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
      } else {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
      }
    }
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
  };

  // Update preferences
  const updatePreferences = (newPrefs: any) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  // Alias for isDarkMode
  const isDark = isDarkMode;
  const systemTheme = isDark ? 'dark' : 'light';

  const setSoundEnabled = (enabled: boolean) => {
    updatePreferences({ soundEnabled: enabled });
  };

  const setReduceMotion = (reduced: boolean) => {
    updatePreferences({ reduceMotion: reduced });
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
      soundEnabled: preferences.soundEnabled,
      reduceMotion: preferences.reduceMotion,
      setSoundEnabled,
      setReduceMotion,
      preferences,
      updatePreferences
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

export default ThemeProvider;
