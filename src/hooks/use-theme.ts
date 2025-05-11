
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import type { Theme } from '@/contexts/ThemeContext';

export function useTheme() {
  return useThemeContext();
}

export type { Theme };

export default useTheme;
