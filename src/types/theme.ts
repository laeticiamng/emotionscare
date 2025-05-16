
export type Theme = 'light' | 'dark' | 'pastel' | 'system';

export interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
}

export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'x-large';
export type FontFamily = 'system' | 'serif' | 'mono' | 'sans' | 'sans-serif' | 'monospace';

export interface ThemeButtonProps {
  variant?: string;
  size?: string;
}
