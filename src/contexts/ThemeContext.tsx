import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark';
type ThemePreference = ThemeType | 'system';

interface ThemeContextType {
  theme: ThemeType;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  setThemePreference: (preference: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem('themePreference');
    if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system') {
      return storedTheme as ThemePreference;
    }
    // Default to system
    return 'system';
  });
  
  const [theme, setTheme] = useState<ThemeType>(() => {
    // If preference is system, use browser preference
    if (themePreference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // Otherwise use the explicit preference
    return themePreference as ThemeType;
  });

  // Listen for changes in system theme if preference is 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (themePreference === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themePreference]);

  // Update the theme when preference changes
  useEffect(() => {
    if (themePreference === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(themePreference as ThemeType);
    }
    
    // Store the preference
    localStorage.setItem('themePreference', themePreference);
  }, [themePreference]);

  useEffect(() => {
    // Update the document class when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemePreference(prevTheme => {
      if (prevTheme === 'system') {
        return theme === 'dark' ? 'light' : 'dark';
      } else {
        return prevTheme === 'dark' ? 'light' : 'dark';
      }
    });
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themePreference,
      toggleTheme, 
      setTheme, 
      setThemePreference,
      isDark 
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
