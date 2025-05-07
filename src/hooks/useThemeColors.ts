
import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface WellnessColors {
  blue: string;
  mint: string;
  coral: string;
  lavender: string;
  gold: string;
}

export const useThemeColors = () => {
  const { theme } = useTheme();
  
  const colors = useMemo(() => {
    switch (theme) {
      case 'dark':
        return {
          background: 'rgb(13, 17, 23)',
          foreground: 'rgb(230, 237, 243)',
          card: 'rgb(22, 27, 34)',
          cardForeground: 'rgb(230, 237, 243)',
          popover: 'rgb(22, 27, 34)',
          popoverForeground: 'rgb(230, 237, 243)',
          primary: '#9b87f5',
          primaryForeground: 'rgb(13, 17, 23)',
          secondary: 'rgb(24, 31, 41)',
          secondaryForeground: 'rgb(230, 237, 243)',
          muted: 'rgb(24, 31, 41)',
          mutedForeground: 'rgb(139, 148, 158)',
          accent: 'rgb(24, 31, 41)',
          accentForeground: 'rgb(230, 237, 243)',
          destructive: 'rgb(248, 81, 73)',
          destructiveForeground: 'rgb(230, 237, 243)',
          border: 'rgb(33, 38, 45)',
          input: 'rgb(33, 38, 45)',
          ring: '#9b87f5',
        };
      case 'pastel':
        return {
          background: '#fcfcff',
          foreground: '#1a1523',
          card: '#ffffff',
          cardForeground: '#1a1523',
          popover: '#ffffff',
          popoverForeground: '#1a1523',
          primary: '#7E69AB',
          primaryForeground: '#ffffff',
          secondary: '#f5f1ff',
          secondaryForeground: '#7E69AB',
          muted: '#f5f1ff',
          mutedForeground: '#6f6e77',
          accent: '#f5f1ff',
          accentForeground: '#1a1523',
          destructive: '#ee5479',
          destructiveForeground: '#ffffff',
          border: '#e4dffc',
          input: '#e4dffc',
          ring: '#7E69AB',
        };
      default: // light theme
        return {
          background: '#ffffff',
          foreground: 'rgb(10, 10, 10)',
          card: '#ffffff',
          cardForeground: 'rgb(10, 10, 10)',
          popover: '#ffffff',
          popoverForeground: 'rgb(10, 10, 10)',
          primary: '#6E59A5',
          primaryForeground: '#ffffff',
          secondary: '#f4f4f5',
          secondaryForeground: 'rgb(10, 10, 10)',
          muted: '#f4f4f5',
          mutedForeground: '#71717a',
          accent: '#f4f4f5',
          accentForeground: 'rgb(10, 10, 10)',
          destructive: '#ef4444',
          destructiveForeground: '#ffffff',
          border: '#e4e4e7',
          input: '#e4e4e7',
          ring: '#6E59A5',
        };
    }
  }, [theme]);
  
  const wellness = useMemo<WellnessColors>(() => {
    switch (theme) {
      case 'dark':
        return {
          blue: '#4A90E2',
          mint: '#7ED321',
          coral: '#FF5A5F',
          lavender: '#9B87F5',
          gold: '#F5A623',
        };
      case 'pastel':
        return {
          blue: '#8ECAE6',
          mint: '#A8E6CF',
          coral: '#FFB6B9',
          lavender: '#CBC3E3',
          gold: '#F7D488',
        };
      default: // light theme
        return {
          blue: '#3498db',
          mint: '#2ecc71',
          coral: '#e74c3c',
          lavender: '#9b59b6',
          gold: '#f1c40f',
        };
    }
  }, [theme]);
  
  return { colors, wellness, currentTheme: theme };
};

export default useThemeColors;
