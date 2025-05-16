
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Theme, ThemeContextType } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme === 'dark');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'pastel');
    document.documentElement.classList.add(theme);
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('pastel');
    else setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme,
      isDarkMode,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
