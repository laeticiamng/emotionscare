
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeContextType } from '@/types/theme';

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => null,
  toggleTheme: () => null,
  isDarkMode: false
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from localStorage or default to 'pastel'
    if (typeof window !== "undefined") {
      return (localStorage.getItem('theme') as Theme) || 'pastel';
    }
    return 'pastel'; // Default to pastel blue theme
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    const oldTheme = root.classList.contains('dark') ? 'dark' 
                   : root.classList.contains('light') ? 'light'
                   : root.classList.contains('pastel') ? 'pastel'
                   : 'system';
    
    root.classList.remove('dark', 'light', 'pastel');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === 'dark');
    } else {
      root.classList.add(theme);
      setIsDarkMode(theme === 'dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Handle theme toggle cycling: pastel -> light -> dark -> pastel
  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'pastel') return 'light';
      if (current === 'light') return 'dark';
      return 'pastel';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
