
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded';
export type FontSize = 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  getContrastText?: (color: string) => 'black' | 'white';
}
