
import { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace' | 'sans';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  toggleTheme?: () => void;
  getContrastText?: (color: string) => 'black' | 'white';
}

export interface ThemeButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning' | 'info' | 'error';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'md';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
