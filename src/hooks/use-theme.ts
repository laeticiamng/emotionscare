
import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-local-storage';

type Theme = 'light' | 'dark' | 'system' | 'pastel' | 'nature' | 'deep-night';

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeValue] = useLocalStorage<Theme>('theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'pastel', 'nature', 'deep-night');
    
    // Handle system preference
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      // Add the selected theme
      root.classList.add(theme);
      
      // For extended themes, also add their base
      if (theme === 'pastel' || theme === 'nature') {
        root.classList.add('light');
        setResolvedTheme('light');
      } else if (theme === 'deep-night') {
        root.classList.add('dark');
        setResolvedTheme('dark');
      } else {
        setResolvedTheme(theme as 'light' | 'dark');
      }
    }
    
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeValue(newTheme);
  };

  return {
    theme,
    setTheme,
    resolvedTheme
  };
}
