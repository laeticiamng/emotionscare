
import { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontFamily = 'system' | 'serif' | 'sans-serif' | 'monospace';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  getContrastText?: (color: string) => 'black' | 'white';
}

export interface ThemeButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}
