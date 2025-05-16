
export interface Theme {
  id: string;
  name: string;
  value: string;
  preview?: string;
}

export type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export type FontFamily = "system" | "serif" | "sans-serif" | "monospace" | "sans" | "inter";
export type FontSize = "small" | "medium" | "large" | "x-large" | "sm" | "md" | "lg" | "xl";
