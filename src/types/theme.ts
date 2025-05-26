
export type ThemeName = 'light' | 'dark' | 'system';
export type FontSize = 'sm' | 'md' | 'lg';
export type FontFamily = 'sans' | 'serif' | 'mono';

export interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
}
