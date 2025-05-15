
// Theme related types
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type ThemeName = Theme; // Alias for backward compatibility
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'system-ui' | 'serif' | 'sans-serif' | 'sans' | 'monospace' | 'mono' | 'rounded' | 'inter' | 'default';

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
  onClick: () => void;
  active: boolean;
}
