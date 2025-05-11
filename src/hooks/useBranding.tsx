
import { useContext } from 'react';
import { Theme } from '@/types/branding';
import { ThemeContext } from '@/contexts/ThemeContext';

export const useBranding = () => {
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    throw new Error('useBranding must be used within a ThemeProvider');
  }
  
  const isDarkMode = themeContext.theme === 'dark';
  
  const getContrastText = (color: string) => {
    // Simple contrast calculation
    return color === 'dark' || color === 'black' || color.startsWith('#0') || color.startsWith('#1') || color.startsWith('#2')
      ? 'white'
      : 'black';
  };
  
  const isPastelTheme = themeContext.theme === 'pastel' as Theme;
  
  return {
    theme: themeContext.theme,
    setTheme: themeContext.setTheme,
    isDarkMode,
    isPastelTheme,
    getContrastText,
    // Add more branding-related utilities as needed
  };
};
