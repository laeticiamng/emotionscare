
import React, { createContext, useContext, useEffect, useState } from 'react';

// Export these types so they can be used in other components
export type Theme = 'dark' | 'light' | 'system' | 'pastel';
export type FontFamily = 'inter' | 'serif' | 'mono' | 'roboto' | 'poppins' | 'montserrat' | 'default';
export type FontSize = 'small' | 'medium' | 'large';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme?: Theme | string; // The actual theme applied (e.g. when system preference is used)
  setTheme: (theme: Theme) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (fontFamily: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (fontSize: FontSize) => void;
  setThemePreference?: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage for theme preferences
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme as Theme) || 'system';
  });
  
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    // Check local storage for font family preference
    const storedFontFamily = localStorage.getItem('fontFamily');
    return (storedFontFamily as FontFamily) || 'inter';
  });
  
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    // Check local storage for font size preference
    const storedFontSize = localStorage.getItem('fontSize');
    return (storedFontSize as FontSize) || 'medium';
  });
  
  // Calculate the resolved theme based on system preference when theme is 'system'
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing classes
    root.classList.remove('light', 'dark', 'pastel');
    
    // Apply the appropriate theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      root.classList.add(theme);
      setResolvedTheme(theme);
    }
    
    // Apply font family
    root.classList.remove('font-inter', 'font-serif', 'font-mono', 'font-roboto', 'font-poppins', 'font-montserrat');
    root.classList.add(`font-${fontFamily}`);
    
    // Apply font size
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${fontSize}`);
    
    // Store the choices in local storage
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontSize', fontSize);
  }, [theme, fontFamily, fontSize]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(newTheme);
        setResolvedTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        fontFamily, 
        setFontFamily, 
        fontSize, 
        setFontSize,
        resolvedTheme,
        setThemePreference
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
