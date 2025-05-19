
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export type Theme = ThemeName;

export type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded';

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (family: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
  preferences?: {
    reduceMotion?: boolean;
    highContrast?: boolean;
  };
  updatePreferences?: (prefs: any) => void;
  reduceMotion?: boolean;
}
