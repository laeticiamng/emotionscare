
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system' | 'pastel';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  
  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        if (parsedTheme && (parsedTheme === 'light' || parsedTheme === 'dark' || parsedTheme === 'system' || parsedTheme === 'pastel')) {
          setThemeState(parsedTheme);
        }
      }
      
      // Check for reduced motion preference
      const reducedMotionPref = localStorage.getItem('reduceMotion');
      if (reducedMotionPref) {
        setReduceMotion(JSON.parse(reducedMotionPref));
      } else {
        // Check system preference for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setReduceMotion(prefersReducedMotion);
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  }, []);
  
  // Update actual theme classname on document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'pastel');
    
    // Apply theme class
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === 'dark');
    } else {
      root.classList.add(theme);
      setIsDarkMode(theme === 'dark');
    }
    
    // Save theme to localStorage
    try {
      localStorage.setItem('theme', JSON.stringify(theme));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [theme]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark', 'pastel');
      document.documentElement.classList.add(newTheme);
      setIsDarkMode(newTheme === 'dark');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Toggle theme function
  const toggleTheme = () => {
    if (theme === 'light') setThemeState('dark');
    else if (theme === 'dark') setThemeState('pastel');
    else if (theme === 'pastel') setThemeState('system');
    else setThemeState('light');
  };
  
  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  // Update reduceMotion preference
  useEffect(() => {
    try {
      localStorage.setItem('reduceMotion', JSON.stringify(reduceMotion));
    } catch (error) {
      console.error('Error saving motion preference:', error);
    }
  }, [reduceMotion]);
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDarkMode, 
      toggleTheme,
      reduceMotion,
      setReduceMotion
    }}>
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

export default ThemeProvider;
