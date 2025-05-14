
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, FontFamily, FontSize, ThemeContextType } from '@/types/types';

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Effet pour vérifier la préférence utilisateur
  useEffect(() => {
    // Vérifier la préférence de thème dans localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'pastel') {
      setTheme(storedTheme);
      setIsDarkMode(storedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      setIsDarkMode(true);
    }

    // Vérifier les préférences de police et taille
    const storedFontFamily = localStorage.getItem('fontFamily') as FontFamily | null;
    if (storedFontFamily) {
      setFontFamily(storedFontFamily);
    }

    const storedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    if (storedFontSize) {
      setFontSize(storedFontSize);
    }
  }, []);

  // Effet pour appliquer le thème à l'élément HTML
  useEffect(() => {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      setIsDarkMode(true);
    } else {
      html.classList.remove('dark');
      setIsDarkMode(false);
    }
    
    // Stockage de la préférence
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effet pour appliquer la famille de police
  useEffect(() => {
    const html = document.documentElement;
    html.style.fontFamily = getFontFamilyValue(fontFamily);
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  // Effet pour appliquer la taille de police
  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize = getFontSizeValue(fontSize);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Helpers pour obtenir les valeurs CSS
  const getFontFamilyValue = (family: FontFamily): string => {
    switch (family) {
      case 'sans-serif': return 'ui-sans-serif, system-ui, sans-serif';
      case 'serif': return 'ui-serif, Georgia, serif';
      case 'mono': return 'ui-monospace, SFMono-Regular, monospace';
      case 'rounded': return 'ui-rounded, system-ui, sans-serif';
      case 'inter': return 'Inter var, system-ui, sans-serif';
      default: return 'Inter var, system-ui, sans-serif';
    }
  };

  const getFontSizeValue = (size: FontSize): string => {
    switch (size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      case 'extra-large': return '1.25rem';
      default: return '1rem'; // medium
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDarkMode,
    fontFamily,
    fontSize,
    setFontFamily,
    setFontSize
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
