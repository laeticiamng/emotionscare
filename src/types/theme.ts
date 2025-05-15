
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'extra-large';
export type FontFamily = 'default' | 'serif' | 'mono' | 'sans' | 'inter' | 'system-ui';
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isDarkMode: boolean;
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
