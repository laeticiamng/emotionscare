
import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName, Theme } from '@/types';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  themes: Record<ThemeName, Theme>;
}

const defaultTheme: ThemeName = 'system';

const defaultThemes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    value: 'light',
    colors: {
      primary: '#0070f3',
      secondary: '#ff0080',
      accent: '#1fb2a6',
      background: '#ffffff',
      text: '#1a1a1a'
    }
  },
  dark: {
    name: 'dark',
    value: 'dark',
    colors: {
      primary: '#0070f3',
      secondary: '#ff0080',
      accent: '#1fb2a6',
      background: '#000000',
      text: '#ffffff'
    }
  },
  system: {
    name: 'system',
    value: 'system',
    colors: {
      primary: '#0070f3',
      secondary: '#ff0080',
      accent: '#1fb2a6',
      background: 'system-defined',
      text: 'system-defined'
    }
  },
  pastel: {
    name: 'pastel',
    value: 'pastel',
    colors: {
      primary: '#a0d2eb',
      secondary: '#e5eaf5',
      accent: '#d0bdf4',
      background: '#fcf4ff',
      text: '#494949'
    }
  }
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => null,
  toggleTheme: () => null,
  themes: defaultThemes
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system' || savedTheme === 'pastel')) {
      setTheme(savedTheme);
    }
    
    // Apply the theme class to the document
    applyTheme(savedTheme || theme);
  }, []);
  
  useEffect(() => {
    // Apply theme when it changes
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const applyTheme = (currentTheme: ThemeName) => {
    const root = window.document.documentElement;
    const isDark = 
      currentTheme === 'dark' ||
      (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply special pastel theme if selected
    if (currentTheme === 'pastel') {
      root.classList.add('theme-pastel');
    } else {
      root.classList.remove('theme-pastel');
    }
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      if (prevTheme === 'system') return 'pastel';
      return 'light';
    });
  };
  
  const value = {
    theme,
    setTheme,
    toggleTheme,
    themes: defaultThemes,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
