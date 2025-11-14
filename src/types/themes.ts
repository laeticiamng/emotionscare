/**
 * Types pour le système de thèmes personnalisables avancés
 * Phase 3 - Excellence
 */

export interface ThemeColors {
  // Couleurs principales
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;

  // Couleurs de fond
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;

  // Couleurs sémantiques
  muted: string;
  'muted-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  success: string;
  'success-foreground': string;
  warning: string;
  'warning-foreground': string;
  info: string;
  'info-foreground': string;

  // UI Elements
  border: string;
  input: string;
  ring: string;

  // Chart colors
  'chart-1': string;
  'chart-2': string;
  'chart-3': string;
  'chart-4': string;
  'chart-5': string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  mono: string;
}

export interface ThemeSpacing {
  scale: number; // 0.8 = compact, 1 = normal, 1.2 = comfortable
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface ThemeEffects {
  blur: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadows: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animations: boolean;
  reducedMotion: boolean;
}

export interface ThemeAccessibility {
  highContrast: boolean;
  focusIndicatorStyle: 'outline' | 'ring' | 'underline';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface CustomTheme {
  id: string;
  name: string;
  description?: string;
  mode: 'light' | 'dark' | 'auto';
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  effects: ThemeEffects;
  accessibility: ThemeAccessibility;
  isBuiltIn: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  thumbnail?: string;
  tags?: string[];
}

export interface UserThemePreferences {
  userId: string;
  activeThemeId: string;
  customThemes: CustomTheme[];
  autoSwitchEnabled: boolean;
  lightThemeId?: string;
  darkThemeId?: string;
  switchTime?: {
    lightModeStart: string; // "06:00"
    darkModeStart: string; // "20:00"
  };
  syncAcrossDevices: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'accessibility' | 'seasonal' | 'mood' | 'premium';
  theme: Omit<CustomTheme, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
  thumbnail: string;
  isPremium: boolean;
  tags: string[];
}

export type ThemeExport = CustomTheme & {
  version: string;
  exportedAt: string;
};
