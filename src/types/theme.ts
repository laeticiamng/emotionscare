
export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'xl' | 'x-large' | 'xx-large' | 'extra-large';
export type FontFamily = 'system' | 'system-ui' | 'sans' | 'sans-serif' | 'serif' | 'mono' | 'monospace' | 'rounded' | 'inter' | 'default';
export type ThemeName = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  getContrastText: (color: string) => 'black' | 'white';
}

export interface ThemeButtonProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export interface ThemeSwitcherProps {
  className?: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}
