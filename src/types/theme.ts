
/**
 * theme.ts
 * Définit les palettes de couleurs pour les différents thèmes de l'application
 * Facilite l'accès aux couleurs dans les composants React
 */

// Types pour les thèmes
export type ThemeName = 'light' | 'dark' | 'pastel';
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xl';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded' | 'inter' | 'system-ui' | 'sans' | 'serif' | 'mono';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  getContrastText?: (color: string) => 'black' | 'white';
  primaryColor?: string;
}

export interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
  collapsed?: boolean;
  size?: string;
}

export interface ThemeSwitcherProps {
  size?: string;
}

// Interface pour définir la structure d'une palette de couleurs
export interface ColorPalette {
  name: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  // Semantic colors
  success: {
    light: string;
    DEFAULT: string; 
    dark: string;
  };
  warning: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
  info: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
  error: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
}
