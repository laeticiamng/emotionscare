
import { useContext } from 'react';
import { ThemeContext, useTheme as useThemeOriginal } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Re-export the hook from ThemeContext for backward compatibility
export { useThemeOriginal };
