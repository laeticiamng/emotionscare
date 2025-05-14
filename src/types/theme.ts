
export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export type FontFamily = 
  | 'inter' 
  | 'system' 
  | 'serif'
  | 'mono'
  | 'rounded'
  | 'sans-serif';

export type FontSize = 
  | 'small' 
  | 'medium' 
  | 'large'
  | 'extra-large';

export interface ThemePreviewProps {
  theme: Theme;
  isActive?: boolean;
  onClick?: () => void;
}

export interface ThemeButtonProps {
  collapsed?: boolean;
}

export interface AppTheme {
  theme: Theme;
  fontFamily: FontFamily;
  fontSize: FontSize;
  animations: boolean;
  soundEffects: boolean;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  fontFamily: FontFamily;
  fontSize: FontSize;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
}
