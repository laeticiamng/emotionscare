
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel' | 'forest' | 'ocean';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'system' | 'serif' | 'mono';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  resolvedTheme?: Theme; // Added property
  setThemePreference?: (theme: Theme) => void; // Added property
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('light');

  useEffect(() => {
    // Get saved preferences from localStorage or system
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    const savedFontSize = localStorage.getItem('fontSize') as FontSize || 'medium';
    const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily || 'inter';
    
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setFontFamily(savedFontFamily);
    
    // Set initial dark mode based on theme
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      setResolvedTheme('dark');
    } else if (savedTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemDark);
      setResolvedTheme(systemDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(systemDark ? 'dark' : 'light');
      setIsDarkMode(systemDark);
      setResolvedTheme(systemDark ? 'dark' : 'light');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
      setResolvedTheme('dark');
    } else {
      document.documentElement.classList.add('light');
      setIsDarkMode(false);
      setResolvedTheme(theme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }[fontSize];
    
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);
  
  useEffect(() => {
    // Apply font family
    const fontFamilyMap = {
      inter: '"Inter", sans-serif',
      roboto: '"Roboto", sans-serif',
      poppins: '"Poppins", sans-serif',
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      serif: 'Georgia, "Times New Roman", serif',
      mono: '"Roboto Mono", "Source Code Pro", monospace'
    };
    
    document.documentElement.style.fontFamily = fontFamilyMap[fontFamily];
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // Adding setThemePreference as an alias for setTheme for compatibility
  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        fontSize, 
        setFontSize, 
        fontFamily, 
        setFontFamily, 
        isDarkMode, 
        toggleDarkMode,
        resolvedTheme,
        setThemePreference
      }}
    >
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

export default ThemeContext;
