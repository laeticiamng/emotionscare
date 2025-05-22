
import React, { createContext, useState, useEffect } from 'react';

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDarkMode: false
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}) => {
  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem(storageKey) || defaultTheme
  );
  
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
      
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };
  
  const value = {
    theme,
    setTheme: (theme: string) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme,
    isDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
