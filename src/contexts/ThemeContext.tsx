
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FontFamily, FontSize, ThemeName, ThemeContextType } from '@/types';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
  fontFamily: 'system',
  setFontFamily: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>('system');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Load theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Load font family from localStorage
    const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily;
    if (savedFontFamily) {
      setFontFamily(savedFontFamily);
    }
    
    // Load font size from localStorage
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);
  
  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    // Determine if dark mode should be applied
    let shouldUseDark = theme === 'dark';
    if (theme === 'system') {
      shouldUseDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (shouldUseDark) {
      root.classList.add('dark');
      setIsDarkMode(true);
    } else {
      root.classList.add('light');
      setIsDarkMode(false);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    // Apply font family to document
    const root = window.document.documentElement;
    root.style.setProperty('--font-family', fontFamily);
    
    // Save to localStorage
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);
  
  useEffect(() => {
    // Apply font size to document
    const root = window.document.documentElement;
    root.style.setProperty('--font-size', fontSize);
    
    // Save to localStorage
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);
  
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

// Export for other files to import
export type { ThemeName, FontFamily, FontSize };
export { ThemeContext };
