
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type FontFamily = 'system-ui' | 'sans-serif' | 'serif' | 'monospace' | 'sans' | 'serif' | 'mono' | 'inter';
export type ThemeName = 'light' | 'dark' | 'system';

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
  theme: Theme;
  onClick: () => void;
  isActive?: boolean;
}

export interface ThemeSwitcherProps {
  currentTheme: Theme;
  onChange: (theme: Theme) => void;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}
