
// This file is now obsolete and redirects to the main context
import { ThemeProvider as MainThemeProvider, useTheme } from '@/contexts/ThemeContext';
import type { Theme, ThemeContextType, FontFamily, FontSize } from '@/types/types';

export type ThemeName = Theme;

// Create a wrapper component that handles the new props
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}> = ({ children, defaultTheme, storageKey }) => {
  return <MainThemeProvider>{children}</MainThemeProvider>;
};

export { useTheme };
export type { Theme, ThemeContextType, FontFamily, FontSize };
