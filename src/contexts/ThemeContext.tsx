
import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName, Theme } from '@/types/theme';

// Export the ThemeContext so it can be imported directly
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system' as ThemeName,
  setTheme: () => null,
  toggleTheme: () => null,
  themes: {} as Record<ThemeName, Theme>
});

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  themes: Record<ThemeName, Theme>;
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  reduceMotion?: boolean;
  setReduceMotion?: (reduced: boolean) => void;
  isDarkMode?: boolean;
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

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    const savedSoundEnabled = localStorage.getItem('soundEnabled') === 'true';
    const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system' || savedTheme === 'pastel')) {
      setTheme(savedTheme);
    }
    
    setSoundEnabled(savedSoundEnabled);
    setReduceMotion(savedReduceMotion);
    
    // Apply the theme class to the document
    applyTheme(savedTheme || theme);
  }, []);
  
  useEffect(() => {
    // Apply theme when it changes
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('reduceMotion', reduceMotion.toString());
  }, [reduceMotion]);
  
  const applyTheme = (currentTheme: ThemeName) => {
    const root = window.document.documentElement;
    const isDarkTheme = 
      currentTheme === 'dark' ||
      (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDarkTheme) {
      root.classList.add('dark');
      setIsDarkMode(true);
    } else {
      root.classList.remove('dark');
      setIsDarkMode(false);
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
    soundEnabled,
    setSoundEnabled,
    reduceMotion,
    setReduceMotion,
    isDarkMode
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
