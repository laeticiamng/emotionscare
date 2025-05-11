
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import type { Theme, FontFamily, FontSize, ThemeContextType } from '@/contexts/ThemeContext';

export function useTheme(): ThemeContextType | undefined {
  return useThemeContext();
}

export type { Theme, ThemeContextType, FontFamily, FontSize };

export default useTheme;
