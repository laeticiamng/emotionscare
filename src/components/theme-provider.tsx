
import * as React from 'react';
import { ThemeContextType, ThemeName, FontSize, FontFamily } from '@/types/theme';

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
  isDarkMode: false,
  fontSize: 'md',
  setFontSize: () => {},
  fontFamily: 'sans',
  setFontFamily: () => {},
  systemTheme: 'light',
  reduceMotion: false,
  setReduceMotion: () => {},
  soundEnabled: false,
  setSoundEnabled: () => {}
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultFontSize = 'md',
  defaultFontFamily = 'sans',
  defaultReduceMotion = false,
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  defaultFontSize?: FontSize;
  defaultFontFamily?: FontFamily;
  defaultReduceMotion?: boolean;
}) {
  const [theme, setTheme] = React.useState<ThemeName>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<ThemeName>('light');
  const [fontSize, setFontSize] = React.useState<FontSize>(defaultFontSize);
  const [fontFamily, setFontFamily] = React.useState<FontFamily>(defaultFontFamily);
  const [reduceMotion, setReduceMotion] = React.useState<boolean>(defaultReduceMotion);
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setSystemTheme(systemTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    
    // Apply font size
    root.style.setProperty('--font-size', fontSize);
    
    // Apply font family
    root.style.setProperty('--font-family', fontFamily);
    
    // Apply motion preferences
    if (reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [theme, fontSize, fontFamily, reduceMotion]);

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        setSystemTheme(newSystemTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newSystemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  };
  
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  
  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isDarkMode: isDark,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    systemTheme,
    reduceMotion,
    setReduceMotion,
    soundEnabled,
    setSoundEnabled,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
