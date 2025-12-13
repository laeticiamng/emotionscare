// @ts-nocheck
/**
 * Theme Types - Système de thèmes et personnalisation visuelle
 * Types pour la gestion des thèmes, palettes de couleurs et accessibilité
 */

/** Thèmes disponibles */
export type Theme = 'light' | 'dark' | 'system';

/** Modes de contraste */
export type ContrastMode = 'normal' | 'high' | 'low';

/** Tailles de police */
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

/** Densité d'affichage */
export type DisplayDensity = 'compact' | 'comfortable' | 'spacious';

/** Schémas de couleurs */
export type ColorScheme = 'default' | 'calm' | 'vibrant' | 'nature' | 'sunset' | 'ocean' | 'custom';

/** Type de contexte du thème */
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  reduceMotion: boolean;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  customColors?: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
  resetToDefaults: () => void;
}

/** Couleurs personnalisées */
export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

/** Palette de couleurs complète */
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

/** Variables de thème */
export interface ThemeVariables {
  // Couleurs principales
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  colorTextMuted: string;

  // États
  colorError: string;
  colorWarning: string;
  colorSuccess: string;
  colorInfo: string;

  // Bordures et ombres
  colorBorder: string;
  colorDivider: string;
  shadowColor: string;

  // Espacements
  spacingUnit: number;
  spacingXs: string;
  spacingSm: string;
  spacingMd: string;
  spacingLg: string;
  spacingXl: string;

  // Typographie
  fontFamily: string;
  fontFamilyMono: string;
  fontSizeBase: string;
  fontSizeSmall: string;
  fontSizeLarge: string;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightBold: number;
  lineHeight: number;

  // Rayons de bordure
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
  radiusFull: string;

  // Transitions
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;

  // Z-Index
  zIndexDropdown: number;
  zIndexModal: number;
  zIndexTooltip: number;
  zIndexToast: number;
}

/** Configuration de thème */
export interface ThemeConfig {
  name: string;
  displayName: string;
  isDark: boolean;
  variables: ThemeVariables;
  palette: {
    primary: ColorPalette;
    secondary: ColorPalette;
    neutral: ColorPalette;
  };
}

/** Préférences de thème utilisateur */
export interface ThemePreferences {
  theme: Theme;
  contrastMode: ContrastMode;
  fontSize: FontSize;
  displayDensity: DisplayDensity;
  colorScheme: ColorScheme;
  reduceMotion: boolean;
  reduceTransparency: boolean;
  customColors?: CustomColors;
  fontFamily?: string;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
}

/** Options d'animation */
export interface AnimationOptions {
  enabled: boolean;
  duration: 'fast' | 'normal' | 'slow';
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  reduceMotion: boolean;
}

/** État du système de thème */
export interface ThemeState {
  currentTheme: Theme;
  resolvedTheme: 'light' | 'dark';
  systemPreference: 'light' | 'dark' | 'no-preference';
  isLoading: boolean;
  preferences: ThemePreferences;
}

/** Événement de changement de thème */
export interface ThemeChangeEvent {
  previousTheme: Theme;
  newTheme: Theme;
  resolvedTheme: 'light' | 'dark';
  timestamp: number;
  source: 'user' | 'system' | 'schedule';
}

/** Programmation de thème */
export interface ThemeSchedule {
  enabled: boolean;
  lightModeStart: string; // HH:mm
  darkModeStart: string;
  useLocation: boolean;
  latitude?: number;
  longitude?: number;
}

/** Breakpoints responsive */
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/** Valeurs par défaut des breakpoints */
export const DEFAULT_BREAKPOINTS: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

/** Valeurs par défaut des préférences */
export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  theme: 'system',
  contrastMode: 'normal',
  fontSize: 'medium',
  displayDensity: 'comfortable',
  colorScheme: 'default',
  reduceMotion: false,
  reduceTransparency: false
};

/** Palette de couleurs par défaut (light) */
export const DEFAULT_LIGHT_PALETTE: Partial<ThemeVariables> = {
  colorPrimary: '#6366f1',
  colorSecondary: '#8b5cf6',
  colorAccent: '#06b6d4',
  colorBackground: '#ffffff',
  colorSurface: '#f8fafc',
  colorText: '#0f172a',
  colorTextMuted: '#64748b',
  colorBorder: '#e2e8f0',
  colorError: '#ef4444',
  colorWarning: '#f59e0b',
  colorSuccess: '#22c55e',
  colorInfo: '#3b82f6'
};

/** Palette de couleurs par défaut (dark) */
export const DEFAULT_DARK_PALETTE: Partial<ThemeVariables> = {
  colorPrimary: '#818cf8',
  colorSecondary: '#a78bfa',
  colorAccent: '#22d3ee',
  colorBackground: '#0f172a',
  colorSurface: '#1e293b',
  colorText: '#f8fafc',
  colorTextMuted: '#94a3b8',
  colorBorder: '#334155',
  colorError: '#f87171',
  colorWarning: '#fbbf24',
  colorSuccess: '#4ade80',
  colorInfo: '#60a5fa'
};

/** Helper pour créer une palette */
export function createColorPalette(baseColor: string): ColorPalette {
  // Implémentation simplifiée - génère des variations
  return {
    50: baseColor,
    100: baseColor,
    200: baseColor,
    300: baseColor,
    400: baseColor,
    500: baseColor,
    600: baseColor,
    700: baseColor,
    800: baseColor,
    900: baseColor,
    950: baseColor
  };
}

/** Helper pour vérifier si le mode sombre est préféré */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

/** Helper pour vérifier si le mouvement réduit est préféré */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Helper pour vérifier si le contraste élevé est préféré */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-contrast: high)').matches ?? false;
}

/** Type guard pour Theme */
export function isValidTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

/** Type guard pour ColorScheme */
export function isValidColorScheme(value: unknown): value is ColorScheme {
  const validSchemes: ColorScheme[] = ['default', 'calm', 'vibrant', 'nature', 'sunset', 'ocean', 'custom'];
  return typeof value === 'string' && validSchemes.includes(value as ColorScheme);
}

export default {
  DEFAULT_BREAKPOINTS,
  DEFAULT_THEME_PREFERENCES,
  DEFAULT_LIGHT_PALETTE,
  DEFAULT_DARK_PALETTE,
  createColorPalette,
  prefersDarkMode,
  prefersReducedMotion,
  prefersHighContrast,
  isValidTheme,
  isValidColorScheme
};
