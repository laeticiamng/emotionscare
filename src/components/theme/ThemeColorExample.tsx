
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Theme } from '@/types';

interface ThemeColorExampleProps {
  theme?: Theme;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({ theme }) => {
  const { isDarkMode } = useTheme();
  const currentTheme = theme || (isDarkMode ? 'dark' : 'light');

  const themeColors = {
    light: {
      background: '#ffffff',
      foreground: '#111111',
      primary: '#8b5cf6',
      secondary: '#d946ef',
      accent: '#f97316',
      muted: '#f1f5f9'
    },
    dark: {
      background: '#111111',
      foreground: '#ffffff',
      primary: '#a78bfa',
      secondary: '#e879f9',
      accent: '#fb923c',
      muted: '#1e293b'
    },
    system: {
      background: isDarkMode ? '#111111' : '#ffffff',
      foreground: isDarkMode ? '#ffffff' : '#111111',
      primary: isDarkMode ? '#a78bfa' : '#8b5cf6',
      secondary: isDarkMode ? '#e879f9' : '#d946ef',
      accent: isDarkMode ? '#fb923c' : '#f97316',
      muted: isDarkMode ? '#1e293b' : '#f1f5f9'
    },
    pastel: {
      background: '#f8fafc',
      foreground: '#334155',
      primary: '#c4b5fd',
      secondary: '#fbcfe8',
      accent: '#fed7aa',
      muted: '#f1f5f9'
    }
  };

  const colors = themeColors[currentTheme];

  return (
    <div className="flex flex-col space-y-2">
      <div 
        className="h-10 rounded-md"
        style={{ backgroundColor: colors.background, border: '1px solid #e2e8f0' }}
      />
      <div 
        className="h-10 rounded-md"
        style={{ backgroundColor: colors.primary }}
      />
      <div 
        className="h-10 rounded-md"
        style={{ backgroundColor: colors.secondary }}
      />
      <div 
        className="h-10 rounded-md"
        style={{ backgroundColor: colors.accent }}
      />
      <div 
        className="h-10 rounded-md"
        style={{ backgroundColor: colors.muted }}
      />
    </div>
  );
};

export default ThemeColorExample;
