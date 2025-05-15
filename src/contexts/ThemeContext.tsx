
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, FontFamily, FontSize, ThemeContextType } from '@/types'; // Updated import path

// Create the theme context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const isDarkMode = theme === 'dark';
  
  // Load preferences from localStorage or system settings
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    // Load font settings if available
    const storedFont = localStorage.getItem('fontFamily') as FontFamily;
    if (storedFont) setFontFamily(storedFont);
    
    const storedSize = localStorage.getItem('fontSize') as FontSize;
    if (storedSize) setFontSize(storedSize);
  }, []);
  
  // Update body class and localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme === 'dark' ? 'dark' : '';
    
    // Apply font family
    if (fontFamily) {
      document.body.style.fontFamily = getFontFamilyValue(fontFamily);
      localStorage.setItem('fontFamily', fontFamily);
    }
    
    // Apply font size
    if (fontSize) {
      document.body.style.fontSize = getFontSizeValue(fontSize);
      localStorage.setItem('fontSize', fontSize);
    }
  }, [theme, fontFamily, fontSize]);
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      fontFamily, 
      setFontFamily, 
      fontSize,
      setFontSize,
      isDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Helper functions to get CSS values
function getFontFamilyValue(family: FontFamily): string {
  switch (family) {
    case 'system': return 'system-ui, sans-serif';
    case 'serif': return 'serif';
    case 'sans-serif': return 'sans-serif';
    case 'monospace': return 'monospace';
    case 'rounded': return 'var(--font-rounded), sans-serif';
    default: return 'system-ui, sans-serif';
  }
}

function getFontSizeValue(size: FontSize): string {
  switch (size) {
    case 'small': return '0.875rem';
    case 'medium': return '1rem';
    case 'large': return '1.125rem';
    case 'x-large': return '1.25rem';
    default: return '1rem';
  }
}

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
