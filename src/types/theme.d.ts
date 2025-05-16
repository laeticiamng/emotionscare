
export type Theme = 'light' | 'dark' | 'pastel' | 'system';
export type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'rounded';
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
}

export interface ThemeButtonProps {
  className?: string;
  hasTopbarLabel?: boolean;
  variant?: "icon" | "outline" | "ghost";
}

export interface ThemeOption {
  name: string;
  value: Theme;
  preview: string;
}
