
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export type FontSize = 'small' | 'medium' | 'large';

export type FontFamily = 'system' | 'serif' | 'mono' | 'sans';

export interface Theme {
  name: ThemeName;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
  isDark?: boolean;
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDarkMode: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
}
