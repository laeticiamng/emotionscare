
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat' | 'raleway';
export type FontSize = 'small' | 'medium' | 'large';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
  fontFamily: 'inter',
  setFontFamily: () => {},
  fontSize: 'medium',
  setFontSize: () => {}
});

export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );
  
  const [fontFamily, setFontFamily] = useState<FontFamily>(
    () => (localStorage.getItem('fontFamily') as FontFamily) || 'inter'
  );
  
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem('fontSize') as FontSize) || 'medium'
  );
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Update theme in localStorage and document when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Handle system theme preference
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      if (systemTheme === 'dark') {
        root.classList.add('dark');
        setIsDarkMode(true);
      } else {
        root.classList.remove('dark');
        setIsDarkMode(false);
      }
      
      return;
    }
    
    // Handle explicit theme preference
    if (theme === 'dark') {
      root.classList.add('dark');
      setIsDarkMode(true);
    } else {
      root.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, [theme]);
  
  // Apply font family
  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    document.documentElement.style.setProperty('--font-family', fontFamily);
  }, [fontFamily]);
  
  // Apply font size
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    const fontSizeValue = fontSize === 'small' ? '0.875rem' : fontSize === 'large' ? '1.125rem' : '1rem';
    document.documentElement.style.setProperty('--font-size-base', fontSizeValue);
  }, [fontSize]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setIsDarkMode(mediaQuery.matches);
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
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

export const useTheme = () => useContext(ThemeContext);
