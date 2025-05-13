
import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
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
