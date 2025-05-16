
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode?: boolean;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  getContrastText?: (color: string) => 'black' | 'white';
  toggleTheme?: () => void;
}
