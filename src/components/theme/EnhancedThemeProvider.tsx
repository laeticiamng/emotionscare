
import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: Theme;
  isDark: boolean;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  toggleTheme: () => null,
  systemTheme: 'light',
  isDark: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function EnhancedThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [systemTheme, setSystemTheme] = useState<Theme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  // Apply theme with transition
  useEffect(() => {
    const root = window.document.documentElement;
    const activeTheme = theme === 'system' ? systemTheme : theme;
    
    setIsTransitioning(true);
    
    // Add transition class
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
    
    setTimeout(() => {
      setIsTransitioning(false);
      root.style.transition = '';
    }, 300);
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  const value = {
    theme,
    setTheme: handleSetTheme,
    toggleTheme,
    systemTheme,
    isDark,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
          className={isTransitioning ? 'pointer-events-none' : ''}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeProviderContext.Provider>
  );
}

export const useEnhancedTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  
  return context;
};
