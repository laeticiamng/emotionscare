
// This file is now obsolete and redirects to the main context
import { 
  ThemeProvider, 
  useTheme, 
  Theme,
  ThemeContextType,
  FontFamily,
  FontSize
} from '@/contexts/ThemeContext';

export type ThemeName = Theme;

export { ThemeProvider, useTheme };
export type { Theme, ThemeContextType, FontFamily, FontSize };
