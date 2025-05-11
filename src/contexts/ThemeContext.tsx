
import React, { createContext, useContext } from 'react';
import { Theme } from '@/types';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemePreference?: (theme: Theme) => void; // Added missing method
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  setThemePreference: () => {}, // Added implementation
});

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
