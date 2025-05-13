import React, { createContext, useState, useContext, useEffect } from 'react';

// Types pour le thème
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'serif' | 'mono' | 'sans';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  resolvedTheme?: Theme;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  fontFamily: 'inter',
  setFontFamily: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('inter');

  // Effet pour charger le thème initial depuis localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const storedFontSize = localStorage.getItem('fontSize') as FontSize;
    const storedFontFamily = localStorage.getItem('fontFamily') as FontFamily;

    if (storedTheme && ['light', 'dark', 'pastel', 'system'].includes(storedTheme)) {
      setThemeState(storedTheme);
    }

    if (storedFontSize && ['small', 'medium', 'large'].includes(storedFontSize)) {
      setFontSizeState(storedFontSize);
    }

    if (storedFontFamily && ['inter', 'serif', 'mono', 'sans'].includes(storedFontFamily)) {
      setFontFamilyState(storedFontFamily);
    }

    // Appliquer le thème au document
    applyTheme(storedTheme || theme);
  }, []);

  // Fonctions pour mettre à jour le thème
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const setFontSize = (newSize: FontSize) => {
    localStorage.setItem('fontSize', newSize);
    setFontSizeState(newSize);
    applyFontSize(newSize);
  };

  const setFontFamily = (newFamily: FontFamily) => {
    localStorage.setItem('fontFamily', newFamily);
    setFontFamilyState(newFamily);
    applyFontFamily(newFamily);
  };

  // Fonctions d'application des changements visuels
  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;
    
    // Déterminer le thème effectif
    let effectiveTheme = selectedTheme;
    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    
    // Appliquer les classes au document
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Appliquer les classes pour le thème pastel si nécessaire
    if (effectiveTheme === 'pastel') {
      document.documentElement.classList.add('theme-pastel');
    } else {
      document.documentElement.classList.remove('theme-pastel');
    }
  };

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    root.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
    
    // Ajouter des classes pour les différentes tailles
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${size}`);
  };

  const applyFontFamily = (family: FontFamily) => {
    const root = document.documentElement;
    root.classList.remove('font-inter', 'font-serif', 'font-mono', 'font-sans');
    root.classList.add(`font-${family}`);
  };

  // Add resolvedTheme to the context value
  const value: ThemeContextType = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    resolvedTheme: theme === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      undefined
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
