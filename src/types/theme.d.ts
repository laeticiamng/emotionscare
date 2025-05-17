
export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface Theme {
  name: string;
  value: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  themes: Record<ThemeName, Theme>;
}
