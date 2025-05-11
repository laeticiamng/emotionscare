import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type ThemeName = Theme;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: 'light' | 'dark' | 'pastel';
  setTheme: (theme: Theme) => void;
  setThemePreference: (theme: Theme) => void;
};

const initialState: ThemeContextType = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
  setThemePreference: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'pastel'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      root.classList.remove('light', 'dark', 'pastel');
      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
      root.setAttribute('data-theme', systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      root.classList.remove('light', 'dark', 'pastel');
      root.classList.add(theme);
      root.style.colorScheme = theme === 'pastel' ? 'light' : theme;
      root.setAttribute('data-theme', theme);
      setResolvedTheme(theme as 'light' | 'dark' | 'pastel');
    }
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'pastel');
        root.classList.add(newTheme);
        root.style.colorScheme = newTheme;
        root.setAttribute('data-theme', newTheme);
        setResolvedTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Add setThemePreference as an alias for setTheme for compatibility
  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        setThemePreference,
      }}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
    
  return context;
};
