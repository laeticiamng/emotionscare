
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define Theme, FontFamily, and FontSize types
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'merriweather' | 'mono' | 'system' | 'system-ui' | 'sans-serif' | 'serif' | 'rounded';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large' | 'x-large' | 'xl';

// Define the ThemeContextType
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  isDarkMode?: boolean;
}

// Create the theme context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');
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
    case 'inter': return 'Inter, sans-serif';
    case 'roboto': return 'Roboto, sans-serif';
    case 'poppins': return 'Poppins, sans-serif';
    case 'merriweather': return 'Merriweather, serif';
    case 'mono': return 'monospace';
    case 'system': return 'system-ui, sans-serif';
    default: return 'Inter, sans-serif';
  }
}

function getFontSizeValue(size: FontSize): string {
  switch (size) {
    case 'small': return '0.875rem';
    case 'medium': return '1rem';
    case 'large': return '1.125rem';
    case 'extra-large': case 'x-large': case 'xl': return '1.25rem';
    default: return '1rem';
  }
}

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
