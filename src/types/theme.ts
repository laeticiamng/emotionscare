
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'rounded' | 'sans' | 'mono' | 'inter';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isDarkMode: boolean;
  getContrastText?: (color: string) => 'black' | 'white';
}

export interface ThemeButtonProps {
  variant?: 'icon' | 'text' | 'both';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'button' | 'toggle';
  position?: 'navbar' | 'sidebar' | 'footer';
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
}
