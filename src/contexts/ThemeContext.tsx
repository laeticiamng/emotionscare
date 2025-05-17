
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theme, FontFamily, FontSize } from '@/types/theme';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  toggleTheme: () => void;
  getContrastText: (color: string) => 'black' | 'white';
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const initialState: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
  isDarkMode: false,
  fontSize: 'medium',
  setFontSize: () => null,
  fontFamily: 'system',
  setFontFamily: () => null,
  toggleTheme: () => null,
  getContrastText: () => 'black',
  reduceMotion: false,
  setReduceMotion: () => null,
  soundEnabled: true,
  setSoundEnabled: () => null
};

export const ThemeContext = createContext<ThemeContextType>(initialState);

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    return storedTheme || 'system';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('fontSize') as FontSize) || 'medium';
  });
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('fontFamily') as FontFamily) || 'system';
  });
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return localStorage.getItem('reduceMotion') === 'true' || false;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Nettoyer les classes de thème existantes
    root.classList.remove('light', 'dark', 'pastel');
    
    // Appliquer le thème actuel
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.add(currentTheme);
    setIsDarkMode(currentTheme === 'dark');
    localStorage.setItem('theme', theme);
    
    // Ajouter class pour le mode de mouvement réduit
    if (reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Observer les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark', 'pastel');
        root.classList.add(newSystemTheme);
        setIsDarkMode(newSystemTheme === 'dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, reduceMotion]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    document.documentElement.dataset.fontFamily = fontFamily;
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('reduceMotion', String(reduceMotion));
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', String(soundEnabled));
  }, [soundEnabled]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('pastel');
    } else {
      setTheme('light');
    }
  };

  // Fonction pour déterminer si le texte doit être noir ou blanc selon la couleur de fond
  const getContrastText = (color: string): 'black' | 'white' => {
    // Convertir hex en RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    
    // Calculer la luminosité relative
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retourner noir ou blanc selon la luminosité
    return luminance > 0.5 ? 'black' : 'white';
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDarkMode,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily,
      toggleTheme,
      getContrastText,
      reduceMotion,
      setReduceMotion,
      soundEnabled,
      setSoundEnabled
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
