
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import type { Theme, ThemeContextType } from '@/contexts/ThemeContext';

export function useTheme(): ThemeContextType | undefined {
  return useThemeContext();
}

export type { Theme, ThemeContextType };

export default useTheme;
