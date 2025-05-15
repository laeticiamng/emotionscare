
// Types liés au thème et à l'apparence de l'application
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
