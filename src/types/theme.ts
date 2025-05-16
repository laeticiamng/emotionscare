
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded' | 'system' | 'sans-serif' | 'monospace' | 'inter';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'x-large';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  getContrastText?: (color: string) => 'black' | 'white';
}

export interface ThemeButtonProps {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}
