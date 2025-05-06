
/**
 * theme.ts
 * Exporte les palettes de couleurs pour les différents thèmes de l'application
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
}

// Palette de couleurs pour le thème clair premium
export const lightTheme: ColorPalette = {
  name: 'light',
  background: 'hsl(0, 0%, 99%)',
  foreground: 'hsl(220, 20%, 16%)',
  card: 'hsl(0, 0%, 100%)',
  cardForeground: 'hsl(220, 20%, 16%)',
  primary: 'hsl(220, 47%, 16%)',
  primaryForeground: 'hsl(210, 40%, 98%)',
  secondary: 'hsl(210, 40%, 96.1%)',
  secondaryForeground: 'hsl(220, 47%, 16%)',
  accent: 'hsl(210, 40%, 96.1%)',
  accentForeground: 'hsl(220, 47%, 16%)',
  muted: 'hsl(210, 40%, 96.1%)',
  mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
  border: 'hsl(214.3, 31.8%, 91.4%)',
  input: 'hsl(214.3, 31.8%, 91.4%)',
  ring: 'hsl(220, 47%, 16%)',
};

// Palette de couleurs pour le thème sombre premium
export const darkTheme: ColorPalette = {
  name: 'dark',
  background: 'hsl(220, 20%, 12%)',
  foreground: 'hsl(210, 40%, 98%)',
  card: 'hsl(220, 20%, 14%)',
  cardForeground: 'hsl(210, 40%, 98%)',
  primary: 'hsl(210, 40%, 98%)',
  primaryForeground: 'hsl(220, 47%, 16%)',
  secondary: 'hsl(220, 15%, 25%)',
  secondaryForeground: 'hsl(210, 40%, 98%)',
  accent: 'hsl(220, 15%, 25%)',
  accentForeground: 'hsl(210, 40%, 98%)',
  muted: 'hsl(220, 15%, 25%)',
  mutedForeground: 'hsl(215, 20%, 75%)',
  border: 'hsl(220, 15%, 25%)',
  input: 'hsl(220, 15%, 22%)',
  ring: 'hsl(210, 40%, 90%)',
};

// Palette de couleurs pour le thème pastel premium
export const pastelTheme: ColorPalette = {
  name: 'pastel',
  background: 'hsl(210, 50%, 97%)',
  foreground: 'hsl(220, 20%, 16%)',
  card: 'hsl(210, 40%, 98%)',
  cardForeground: 'hsl(220, 20%, 16%)',
  primary: 'hsl(210, 70%, 50%)',
  primaryForeground: 'hsl(0, 0%, 100%)',
  secondary: 'hsl(210, 40%, 90%)',
  secondaryForeground: 'hsl(220, 47%, 16%)',
  accent: 'hsl(210, 40%, 85%)',
  accentForeground: 'hsl(220, 47%, 16%)',
  muted: 'hsl(210, 40%, 90%)',
  mutedForeground: 'hsl(220, 15%, 40%)',
  border: 'hsl(210, 40%, 80%)',
  input: 'hsl(210, 40%, 80%)',
  ring: 'hsl(210, 70%, 50%)',
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
