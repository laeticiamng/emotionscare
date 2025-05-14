
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContextType, ThemeName, FontFamily, FontSize } from '@/types/types';

// Create the theme context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
  fontFamily: 'system',
  setFontFamily: () => {},
  fontSize: 'medium',
  setFontSize: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize states from localStorage or default values
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return (savedTheme as ThemeName) || 'system';
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    const savedFont = typeof window !== 'undefined' ? localStorage.getItem('fontFamily') : null;
    return (savedFont as FontFamily) || 'system';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const savedSize = typeof window !== 'undefined' ? localStorage.getItem('fontSize') : null;
    return (savedSize as FontSize) || 'medium';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update theme state and localStorage
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Update font family state and localStorage
  const setFontFamily = (newFont: FontFamily) => {
    setFontFamilyState(newFont);
    localStorage.setItem('fontFamily', newFont);
  };

  // Update font size state and localStorage
  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('fontSize', newSize);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update document classes when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-system', 'theme-pastel');
    
    // Add current theme class
    root.classList.add(`theme-${theme}`);
    
    // Set dark or light mode
    if (theme === 'system') {
      if (isDarkMode) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme, isDarkMode]);

  // Update font classes when font or size changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all font family classes
    root.classList.remove('font-system', 'font-sans-serif', 'font-serif', 'font-mono', 'font-rounded', 'font-inter');
    
    // Add current font family class
    root.classList.add(`font-${fontFamily}`);
    
    // Remove all font size classes
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
    
    // Add current font size class
    root.classList.add(`text-${fontSize}`);
  }, [fontFamily, fontSize]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDarkMode,
      fontFamily,
      setFontFamily,
      fontSize,
      setFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export the context for direct usage
export { ThemeContext };
