
// This file is now obsolete and redirects to the main context
import { 
  ThemeProvider as MainThemeProvider, 
  useTheme, 
  Theme,
  ThemeContextType,
  FontFamily,
  FontSize
} from '@/contexts/ThemeContext';

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
