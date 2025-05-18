
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Theme } from '@/types/theme';

/**
 * A hook that provides type-safe access to the theme context
 * Ensures consistent typing across the application
 */
export const useTheme = () => {
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Ensure the theme is one of the valid values
  const validateTheme = (theme: string): Theme => {
    if (['light', 'dark', 'system', 'pastel'].includes(theme)) {
      return theme as Theme;
    }
    return 'system';
  };

  return {
    ...themeContext,
    theme: validateTheme(themeContext.theme),
    setTheme: (theme: Theme) => themeContext.setTheme(theme),
  };
};

export default useTheme;
