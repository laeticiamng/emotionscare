
export type Theme = 'light' | 'dark' | 'system' | 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'red' | 'yellow' | 'pastel';

export type FontFamily = 
  | 'system'
  | 'sans'
  | 'serif'
  | 'mono'
  | 'rounded';

export type FontSize = 
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark';
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  resetTheme: () => void;
}

export interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}
