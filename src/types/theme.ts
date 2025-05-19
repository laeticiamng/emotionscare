
import * as React from "react";

export type FontFamily = "sans" | "serif" | "mono" | "system";
export type FontSize = "xs" | "sm" | "md" | "lg" | "xl"; // Define the font sizes
export type ThemeName = "light" | "dark" | "system" | "pastel";
export type Theme = "light" | "dark" | "system" | "pastel";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  isDark?: boolean;
  systemTheme: "light" | "dark";
  soundEnabled?: boolean;
  reduceMotion?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
  setReduceMotion?: (enabled: boolean) => void;
}

export interface ThemeOption {
  name: string;
  value: Theme;
  icon?: React.ReactNode;
}
