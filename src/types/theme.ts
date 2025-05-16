
export interface Theme {
  id?: string;
  name: string;
  value: string;
  preview?: string;
}

export type ThemeType = 'light' | 'dark' | 'pastel' | 'system';

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string | Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  fontFamily?: FontFamily;
  setFontFamily?: (fontFamily: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (fontSize: FontSize) => void;
}

export type FontFamily = "system" | "serif" | "sans-serif" | "monospace" | "sans" | "inter" | "rounded";
export type FontSize = "small" | "medium" | "large" | "x-large" | "sm" | "md" | "lg" | "xl";
