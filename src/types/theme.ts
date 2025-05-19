
export type Theme = 'light' | 'dark' | 'system' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'system' | 'rounded';

export interface ThemeOption {
  value: Theme;
  label: string;
  icon?: React.ReactNode;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isDarkMode: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  systemTheme?: 'dark' | 'light';
  preferences?: {
    soundEnabled?: boolean;
    reduceMotion?: boolean;
    highContrast?: boolean;
  };
  updatePreferences?: (prefs: {
    soundEnabled?: boolean;
    reduceMotion?: boolean;
    highContrast?: boolean;
  }) => void;
}
