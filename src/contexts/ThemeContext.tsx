
import React, { createContext, useContext, useState, useEffect } from 'react';

// Définition unifiée des types de thème
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'serif' | 'mono' | 'roboto' | 'poppins' | 'montserrat' | 'default';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme?: 'light' | 'dark' | 'pastel';
  setTheme: (theme: Theme) => void;
  setThemePreference: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Récupérer le thème du localStorage s'il existe
    const savedTheme = localStorage.getItem('theme') as Theme;
    return (savedTheme && ['light', 'dark', 'system', 'pastel'].includes(savedTheme)) 
      ? savedTheme 
      : 'system';
  });

  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily;
    return (savedFontFamily && ['inter', 'serif', 'mono', 'roboto', 'poppins', 'montserrat', 'default'].includes(savedFontFamily))
      ? savedFontFamily
      : 'inter';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    return (savedFontSize && ['small', 'medium', 'large'].includes(savedFontSize))
      ? savedFontSize
      : 'medium';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'pastel'>(
    theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme as 'light' | 'dark' | 'pastel'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Enregistrer la préférence dans localStorage
    localStorage.setItem('theme', theme);
    
    // Résoudre le thème système si nécessaire
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme as 'light' | 'dark');
      
      // Appliquer le thème résolu
      root.classList.remove('light', 'dark', 'system', 'pastel');
      root.classList.add(systemTheme);
    } else {
      // Appliquer directement le thème choisi
      root.classList.remove('light', 'dark', 'system', 'pastel');
      root.classList.add(theme);
      setResolvedTheme(theme as 'light' | 'dark' | 'pastel');
    }
    
    // Appliquer la classe dark au document si nécessaire
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    console.log('Theme updated:', theme, 'Resolved theme:', resolvedTheme);
  }, [theme, resolvedTheme]);

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme as 'light' | 'dark');
        const root = window.document.documentElement;
        
        // Mettre à jour les classes
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Save font preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    
    // Appliquer la famille de police au document
    const root = window.document.documentElement;
    root.classList.remove(
      'font-inter', 'font-serif', 'font-mono', 'font-roboto', 
      'font-poppins', 'font-montserrat'
    );
    
    switch (fontFamily) {
      case 'serif':
        root.classList.add('font-serif');
        break;
      case 'mono':
        root.classList.add('font-mono');
        break;
      case 'roboto':
        root.classList.add('font-roboto');
        break;
      case 'poppins':
        root.classList.add('font-poppins');
        break;
      case 'montserrat':
        root.classList.add('font-montserrat');
        break;
      case 'inter':
      default:
        root.classList.add('font-inter');
        break;
    }
    console.log('Font family updated:', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    
    // Appliquer la taille de police au document
    const root = window.document.documentElement;
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${fontSize}`);
    console.log('Font size updated:', fontSize);
  }, [fontSize]);

  // Create setThemePreference as an alias for setTheme for backward compatibility
  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Validate theme value before returning context
  const validatedTheme: Theme = ['light', 'dark', 'system', 'pastel'].includes(theme as string) 
    ? theme as Theme 
    : 'system';

  return (
    <ThemeContext.Provider value={{ 
      theme: validatedTheme, 
      resolvedTheme,
      setTheme, 
      setThemePreference, 
      fontFamily, 
      setFontFamily, 
      fontSize, 
      setFontSize 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.warn("useTheme must be used within a ThemeProvider");
  }
  return context;
};
