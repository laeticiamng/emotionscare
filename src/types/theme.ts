
// Types pour les thèmes
export type ThemeName = 'light' | 'dark' | 'pastel';
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xl';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded' | 'inter' | 'system-ui' | 'sans' | 'serif' | 'mono';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
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
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  text: string;
  error: string;
  success: string;
  warning: string;
}
