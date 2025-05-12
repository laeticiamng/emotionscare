
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  // Calculer isDarkMode basé sur le thème actuel
  const isDarkMode = context.theme === 'dark' || 
                    (context.theme === 'system' && 
                    context.resolvedTheme === 'dark');
  
  return {
    ...context,
    isDarkMode
  };
};
