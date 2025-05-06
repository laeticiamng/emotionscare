
/**
 * theme.ts
 * Définit les palettes de couleurs pour les différents thèmes de l'application
 * Facilite l'accès aux couleurs dans les composants React
 */

// Types pour les thèmes
export type ThemeName = 'light' | 'dark' | 'pastel';

// Interface pour définir la structure d'une palette de couleurs
export interface ColorPalette {
  name: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  // Semantic colors
  success: {
    light: string;
    DEFAULT: string; 
    dark: string;
  };
  warning: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
  info: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
  error: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
}

// Palette de couleurs pour le thème clair premium
export const lightTheme: ColorPalette = {
  name: 'light',
  background: 'hsl(0, 0%, 100%)', // Pure white for maximum clarity
  foreground: 'hsl(220, 25%, 16%)',
  card: 'hsl(0, 0%, 100%)',
  cardForeground: 'hsl(220, 25%, 16%)',
  primary: 'hsl(220, 100%, 50%)',
  primaryForeground: 'hsl(210, 40%, 98%)',
  secondary: 'hsl(210, 40%, 96.1%)',
  secondaryForeground: 'hsl(220, 47%, 16%)',
  accent: 'hsl(339, 90%, 65%)',
  accentForeground: 'hsl(210, 40%, 98%)',
  muted: 'hsl(210, 40%, 96.1%)',
  mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
  border: 'hsl(214.3, 31.8%, 91.4%)',
  input: 'hsl(214.3, 31.8%, 91.4%)',
  ring: 'hsl(220, 100%, 50%)',
  // Semantic colors
  success: {
    light: '#D1FAE5',
    DEFAULT: '#10B981',
    dark: '#047857',
  },
  warning: {
    light: '#FEF3C7',
    DEFAULT: '#F59E0B',
    dark: '#B45309',
  },
  info: {
    light: '#DBEAFE',
    DEFAULT: '#3B82F6',
    dark: '#1D4ED8',
  },
  error: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#B91C1C',
  },
};

// Palette de couleurs pour le thème sombre premium
export const darkTheme: ColorPalette = {
  name: 'dark',
  background: 'hsl(220, 20%, 12%)',
  foreground: 'hsl(210, 40%, 98%)',
  card: 'hsl(220, 20%, 14%)',
  cardForeground: 'hsl(210, 40%, 98%)',
  primary: 'hsl(217, 91%, 60%)',
  primaryForeground: 'hsl(210, 40%, 98%)',
  secondary: 'hsl(220, 15%, 25%)',
  secondaryForeground: 'hsl(210, 40%, 98%)',
  accent: 'hsl(339, 90%, 65%)',
  accentForeground: 'hsl(210, 40%, 98%)',
  muted: 'hsl(220, 15%, 25%)',
  mutedForeground: 'hsl(215, 20%, 75%)',
  border: 'hsl(220, 15%, 25%)',
  input: 'hsl(220, 15%, 22%)',
  ring: 'hsl(217, 91%, 60%)',
  // Semantic colors with adjusted contrast for dark theme
  success: {
    light: '#064E3B', // Darker background for dark mode
    DEFAULT: '#10B981', 
    dark: '#A7F3D0', // Lighter text for dark mode
  },
  warning: {
    light: '#78350F',
    DEFAULT: '#F59E0B',
    dark: '#FDE68A',
  },
  info: {
    light: '#1E3A8A',
    DEFAULT: '#3B82F6',
    dark: '#BFDBFE',
  },
  error: {
    light: '#7F1D1D',
    DEFAULT: '#EF4444',
    dark: '#FECACA',
  },
};

// Palette de couleurs pour le thème pastel premium
export const pastelTheme: ColorPalette = {
  name: 'pastel',
  background: 'hsl(210, 60%, 98%)', // Very light blue-ish background
  foreground: 'hsl(220, 25%, 20%)',
  card: 'hsl(210, 50%, 99%)',
  cardForeground: 'hsl(220, 25%, 20%)',
  primary: 'hsl(210, 70%, 50%)',
  primaryForeground: 'hsl(0, 0%, 100%)',
  secondary: 'hsl(210, 50%, 92%)',
  secondaryForeground: 'hsl(220, 47%, 16%)',
  accent: 'hsl(339, 90%, 75%)',
  accentForeground: 'hsl(220, 47%, 16%)',
  muted: 'hsl(210, 50%, 92%)',
  mutedForeground: 'hsl(220, 15%, 40%)',
  border: 'hsl(210, 50%, 85%)',
  input: 'hsl(210, 50%, 85%)',
  ring: 'hsl(210, 70%, 50%)',
  // Semantic colors with softer pastel tones
  success: {
    light: '#ECFDF5',
    DEFAULT: '#10B981',
    dark: '#047857',
  },
  warning: {
    light: '#FFFBEB',
    DEFAULT: '#F59E0B',
    dark: '#92400E',
  },
  info: {
    light: '#EFF6FF',
    DEFAULT: '#3B82F6',
    dark: '#1E40AF',
  },
  error: {
    light: '#FEF2F2',
    DEFAULT: '#EF4444',
    dark: '#991B1B',
  },
};

// Couleurs spécifiques pour le thème bien-être (wellness)
export const wellnessColors = {
  blue: 'hsl(210, 67%, 59%)',
  mint: 'hsl(160, 79%, 85%)',
  coral: 'hsl(11, 100%, 69%)',
  peach: 'hsl(25, 100%, 94%)',
  lavender: 'hsl(240, 67%, 94%)',
  darkPurple: '#7E69AB',
  softPurple: '#E5DEFF',
  softBlue: '#D3E4FD',
};

// Exportation de tous les thèmes dans un objet
export const themes: Record<ThemeName, ColorPalette> = {
  light: lightTheme,
  dark: darkTheme,
  pastel: pastelTheme,
};

// Fonction utilitaire pour obtenir un thème par son nom
export const getTheme = (themeName: ThemeName): ColorPalette => {
  return themes[themeName];
};

// Exportation par défaut de tous les thèmes
export default themes;
