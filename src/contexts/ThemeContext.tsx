
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'montserrat' | 'raleway';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Load saved font settings if available
    const savedFont = localStorage.getItem('fontFamily') as FontFamily;
    if (savedFont) setFontFamily(savedFont);
    
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === 'dark');
    } else {
      root.classList.add(theme);
      setIsDarkMode(theme === 'dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDarkMode,
      fontFamily,
      setFontFamily,
      fontSize,
      setFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
