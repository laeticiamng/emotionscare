
export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export type FontFamily = 
  | 'inter' 
  | 'system' 
  | 'serif'
  | 'mono'
  | 'rounded'
  | string; // Add string to fix type errors

export type FontSize = 
  | 'small' 
  | 'medium' 
  | 'large'
  | 'extra-large'
  | string; // Add string to fix type errors

export interface ThemePreviewProps {
  theme: Theme;
  isActive?: boolean; // Added for compatibility
  onClick?: () => void;
}

export interface ThemeButtonProps {
  collapsed?: boolean; // Added for compatibility
}

export interface AppTheme {
  theme: Theme;
  fontFamily: FontFamily;
  fontSize: FontSize;
  animations: boolean;
  soundEffects: boolean;
}
