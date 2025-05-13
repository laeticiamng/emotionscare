
import { useContext } from 'react';
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import type { ThemeContextType } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useThemeContext();
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  // Calculate isDarkMode based on the current theme
  const isDarkMode = context.theme === 'dark' || 
                   (context.theme === 'system' && 
                   context.resolvedTheme === 'dark');
  
  return {
    ...context,
    isDarkMode
  };
};
