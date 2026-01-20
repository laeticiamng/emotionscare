/**
 * Theme Module - Centralized theme exports
 * Single source of truth for theming
 */

// Provider & Hook
export { ThemeProvider, useTheme } from '@/providers/theme';

// Color Palettes
export { 
  lightTheme, 
  darkTheme, 
  pastelTheme, 
  themes,
  getTheme,
  wellnessColors,
  type ThemeName,
  type ColorPalette 
} from './palette';
