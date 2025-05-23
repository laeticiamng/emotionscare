
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

export const useTheme = () => {
  return useThemeContext();
};

export default useTheme;
