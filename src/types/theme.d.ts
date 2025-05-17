
export type Theme = 
  | "light"
  | "dark"
  | "system"
  | "pastel";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  getContrastText?: (color: string) => 'black' | 'white';
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  toggleTheme?: () => void;
  reduceMotion?: boolean;
  setReduceMotion?: (reduce: boolean) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (enabled: boolean) => void;
}

export type FontFamily = 
  | "system"
  | "inter"
  | "sans"
  | "serif"
  | "mono"
  | "monospace"
  | "rounded"
  | "sans-serif";

export type FontSize = 
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xs";

export interface ThemeOption {
  name: string;
  value: Theme;
  preview: string;
}
