
export type ThemeName = 'light' | 'dark' | 'system';

export interface ThemeSettings {
  name: ThemeName;
  label: string;
  description: string;
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}
