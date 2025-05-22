
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode; defaultTheme?: Theme; storageKey?: string; }> = ({ 
  children,
  defaultTheme = 'system',
  storageKey = 'emotionscare-theme'
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Récupérer le thème depuis le localStorage
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      return savedTheme || defaultTheme;
    } catch (e) {
      return defaultTheme;
    }
  });

  useEffect(() => {
    // Sauvegarder le thème dans le localStorage
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }

    // Appliquer le thème au document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, storageKey]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
