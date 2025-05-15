
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Theme, ThemeContextType, FontSize, FontFamily } from '@/types/types';

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultFontFamily?: FontFamily;
  defaultFontSize?: FontSize;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  defaultFontFamily = 'inter',
  defaultFontSize = 'medium'
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [fontFamily, setFontFamily] = useState<FontFamily>(defaultFontFamily);
  const [fontSize, setFontSize] = useState<FontSize>(defaultFontSize);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;

    if (savedTheme) setTheme(savedTheme);
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    // Save theme to localStorage when it changes
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    
    let resolvedTheme = theme;
    
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.classList.add(resolvedTheme);
    setIsDarkMode(resolvedTheme === 'dark');
    
  }, [theme]);

  useEffect(() => {
    // Save font settings and apply them
    if (fontFamily) {
      localStorage.setItem('fontFamily', fontFamily);
      document.documentElement.style.setProperty('--font-family', getFontFamilyValue(fontFamily));
    }
    
    if (fontSize) {
      localStorage.setItem('fontSize', fontSize);
      document.documentElement.setAttribute('data-font-size', fontSize);
    }
  }, [fontFamily, fontSize]);

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        fontFamily, 
        setFontFamily, 
        fontSize, 
        setFontSize, 
        isDarkMode 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Helper to get actual CSS font family values
const getFontFamilyValue = (family: FontFamily): string => {
  const fontMap = {
    'inter': 'var(--font-inter)',
    'roboto': 'var(--font-roboto)',
    'poppins': 'var(--font-poppins)',
    'merriweather': 'var(--font-merriweather)',
    'system': 'system-ui, -apple-system',
    'system-ui': 'system-ui, -apple-system',
    'sans-serif': 'ui-sans-serif, system-ui',
    'serif': 'ui-serif, Georgia',
    'mono': 'ui-monospace, SFMono-Regular',
    'rounded': 'ui-rounded'
  };
  
  return fontMap[family] || fontMap['system'];
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
