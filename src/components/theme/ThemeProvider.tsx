
import { ThemeProvider as ActualThemeProvider } from '@/contexts/ThemeContext';

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
