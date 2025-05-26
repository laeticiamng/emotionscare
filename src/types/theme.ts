
export type ThemeName = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
}

export interface ThemePreferences {
  theme: ThemeName;
  autoSwitch: boolean;
  followSystem: boolean;
}
