
import { ThemeProvider as ActualThemeProvider } from '@/contexts/ThemeContext';
import { useTheme as useActualTheme } from '@/hooks/use-theme';

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}) {
  return (
    <ActualThemeProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      {...props}
    >
      {children}
    </ActualThemeProvider>
  );
}

export const useTheme = useActualTheme;
