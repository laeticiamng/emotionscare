
import React from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'pastel';

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export type FontFamily = 'inter' | 'manrope' | 'system';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
