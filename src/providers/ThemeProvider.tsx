
import { ThemeProvider as ThemeContextProvider } from '@/contexts/ThemeContext';
import React, { ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: 'dark' | 'light' | 'system';
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'emotions-care-theme',
}: ThemeProviderProps) {
  return (
    <ThemeContextProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeContextProvider>
  );
}

export default ThemeProvider;
