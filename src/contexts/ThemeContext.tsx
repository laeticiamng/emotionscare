
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat' | 'raleway';
export type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultFontFamily?: FontFamily;
  defaultFontSize?: FontSize;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultFontFamily = 'inter',
  defaultFontSize = 'medium',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [fontFamily, setFontFamily] = useState<FontFamily>(defaultFontFamily);
  const [fontSize, setFontSize] = useState<FontSize>(defaultFontSize);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedFont = localStorage.getItem('fontFamily') as FontFamily | null;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedFont) setFontFamily(savedFont);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    const root = document.documentElement;
    
    // Handle theme classes
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.remove('light', 'dark', 'pastel');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark', 'pastel');
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (fontFamily) {
      localStorage.setItem('fontFamily', fontFamily);
      const root = document.documentElement;
      
      // Remove any existing font family classes
      root.classList.remove('font-inter', 'font-roboto', 'font-poppins', 'font-montserrat', 'font-raleway');
      
      // Add the new font family class
      root.classList.add(`font-${fontFamily}`);
    }
  }, [fontFamily]);
  
  useEffect(() => {
    if (fontSize) {
      localStorage.setItem('fontSize', fontSize);
      const root = document.documentElement;
      
      // Remove any existing font size classes
      root.classList.remove('text-small', 'text-medium', 'text-large');
      
      // Add the new font size class
      root.classList.add(`text-${fontSize}`);
    }
  }, [fontSize]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

