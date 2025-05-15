
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Theme, FontFamily, FontSize, ThemeContextType } from '@/types';

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { useTheme };
