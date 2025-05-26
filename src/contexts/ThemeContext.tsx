
import React from 'react';
import { ThemeContextType } from '@/types/theme';

// Re-export from the theme provider
export { useTheme } from '@/providers/ThemeProvider';

// Create context for compatibility
export const ThemeContext = React.createContext<ThemeContextType | null>(null);
