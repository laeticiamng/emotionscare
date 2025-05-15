
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode?: boolean;
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
