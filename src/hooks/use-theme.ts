
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme || 'system';
    }
    return 'system';
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
      }
    };

    updateResolvedTheme();
    
    // Listen for changes to the prefers-color-scheme media query
    const listener = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    try {
      mediaQuery.addEventListener('change', listener);
    } catch (e) {
      // Fallback for Safari
      mediaQuery.addListener(listener);
    }
    
    return () => {
      try {
        mediaQuery.removeEventListener('change', listener);
      } catch (e) {
        // Fallback for Safari
        mediaQuery.removeListener(listener);
      }
    };
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  return {
    theme,
    setTheme,
    resolvedTheme
  };
};
