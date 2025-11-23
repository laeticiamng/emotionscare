// @ts-nocheck

/**
 * theme.ts
 * Defines color palettes for the application's various themes
 * Facilitates access to colors in React components
 */

// Theme types
export type ThemeName = 'light' | 'dark' | 'pastel';

// Interface for defining a color palette structure
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

// Premium light theme color palette - Apple-inspired clean design
export const lightTheme: ColorPalette = {
  name: 'light',
  background: '#FFFFFF', // Pure white for maximum clarity
  foreground: '#18181B', // Soft black for text
  card: '#FFFFFF', // Pure white for cards
  cardForeground: '#18181B', // Soft black for card text
  primary: '#2563EB', // Apple blue
  primaryForeground: '#FFFFFF', // White text on primary buttons
  secondary: '#F3F4F6', // Very light gray
  secondaryForeground: '#1F2937', // Dark gray for secondary buttons
  accent: '#3B82F6', // Slightly lighter blue for accents
  accentForeground: '#FFFFFF', // White text on accent color
  muted: '#F9FAFB', // Very light gray/white
  mutedForeground: '#6B7280', // Medium gray for muted text
  border: '#E5E7EB', // Light gray for borders
  input: '#F3F4F6', // Very light gray for input backgrounds
  ring: '#2563EB', // Apple blue for focus rings
  // Semantic colors
  success: {
    light: '#ECFDF5',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FFFBEB',
    DEFAULT: '#F59E0B',
    dark: '#B45309',
  },
  info: {
    light: '#EFF6FF',
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
  },
  error: {
    light: '#FEF2F2',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
  },
};

// Premium dark theme color palette - Deep blacks with vibrant accents
export const darkTheme: ColorPalette = {
  name: 'dark',
  background: '#0F172A', // Deep rich blue-black
  foreground: '#F8FAFC', // Pure white for text
  card: '#1E293B', // Dark blue-gray for cards
  cardForeground: '#F8FAFC', // Pure white for card text
  primary: '#38BDF8', // Bright blue
  primaryForeground: '#0F172A', // Dark background for text on primary
  secondary: '#334155', // Medium dark blue-gray
  secondaryForeground: '#F8FAFC', // White text
  accent: '#22D3EE', // Cyan accent
  accentForeground: '#0F172A', // Dark background for text on accent
  muted: '#1E293B', // Dark blue-gray
  mutedForeground: '#94A3B8', // Light blue-gray for muted text
  border: '#334155', // Medium-dark blue-gray for borders
  input: '#1E293B', // Dark blue-gray for input backgrounds
  ring: '#38BDF8', // Bright blue for focus rings
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
    DEFAULT: '#38BDF8',
    dark: '#BAE6FD',
  },
  error: {
    light: '#7F1D1D',
    DEFAULT: '#EF4444',
    dark: '#FCA5A5',
  },
};

// Pastel theme color palette - Soft blue tones
export const pastelTheme: ColorPalette = {
  name: 'pastel',
  background: '#F0F9FF', // Very light blue background
  foreground: '#1E293B', // Dark blue-gray for text
  card: '#FFFFFF', // White cards for contrast against the light blue
  cardForeground: '#1E293B', // Dark blue-gray for card text
  primary: '#60A5FA', // Pastel blue
  primaryForeground: '#FFFFFF', // White text on primary buttons
  secondary: '#E0F2FE', // Very light blue for secondary elements
  secondaryForeground: '#1E293B', // Dark blue-gray text
  accent: '#93C5FD', // Slightly different pastel blue for accents
  accentForeground: '#1E293B', // Dark text on accent color
  muted: '#E0F2FE', // Very light blue for muted areas
  mutedForeground: '#64748B', // Slate blue-gray for muted text
  border: '#BAE6FD', // Light blue borders
  input: '#F0F9FF', // Very light blue for input backgrounds
  ring: '#60A5FA', // Pastel blue for focus rings
  // Semantic colors with pastel tones
  success: {
    light: '#ECFDF5',
    DEFAULT: '#34D399', // Lighter green
    dark: '#059669',
  },
  warning: {
    light: '#FFFBEB',
    DEFAULT: '#FBBF24', // Lighter amber
    dark: '#B45309',
  },
  info: {
    light: '#EFF6FF',
    DEFAULT: '#60A5FA', // Pastel blue
    dark: '#3B82F6',
  },
  error: {
    light: '#FEF2F2',
    DEFAULT: '#F87171', // Lighter red
    dark: '#DC2626',
  },
};

// Wellness-specific colors
export const wellnessColors = {
  blue: '#60A5FA',
  softBlue: '#D3E4FD',
  lightBlue: '#EBF5FF',
  mint: '#A7F3D0',
  coral: '#F87171',
  peach: '#FECACA',
  lavender: '#DDD6FE',
  darkPurple: '#7E69AB',
  softPurple: '#E5DEFF',
};

// Export all themes in an object
export const themes: Record<ThemeName, ColorPalette> = {
  light: lightTheme,
  dark: darkTheme,
  pastel: pastelTheme,
};

// Utility function to get a theme by name
export const getTheme = (themeName: ThemeName): ColorPalette => {
  return themes[themeName];
};

// Default export of all themes
export default themes;
