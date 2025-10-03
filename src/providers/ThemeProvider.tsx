
import React from 'react';
import { ThemeProvider as BaseThemeProvider, useTheme } from '@/components/theme-provider';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'ui-theme'
}) => {
  return (
    <BaseThemeProvider 
      defaultTheme={defaultTheme as any}
      storageKey={storageKey}
    >
      {children}
    </BaseThemeProvider>
  );
};

export { useTheme };
