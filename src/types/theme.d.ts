
import { ThemeProviderProps } from "next-themes/dist/types";

export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export type FontFamily = 'inter' | 'system' | 'sans' | 'sans-serif' | 'serif' | 'mono' | 'monospace' | 'rounded';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large' | 'x-large' | 'extra-large';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

export interface ThemeButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}
