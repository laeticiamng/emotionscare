
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'opensans';
export type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  fontFamily: 'inter',
  setFontFamily: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultFontFamily?: FontFamily;
  defaultFontSize?: FontSize;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultFontFamily = 'inter',
  defaultFontSize = 'medium',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [fontFamily, setFontFamily] = useState<FontFamily>(
    () => (localStorage.getItem('fontFamily') as FontFamily) || defaultFontFamily
  );
  
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem('fontSize') as FontSize) || defaultFontSize
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-family', fontFamily);
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    fontFamily,
    setFontFamily: (family: FontFamily) => {
      setFontFamily(family);
    },
    fontSize,
    setFontSize: (size: FontSize) => {
      setFontSize(size);
    },
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
