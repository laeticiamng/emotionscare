
import { createContext, useEffect, useState } from "react";
import { ThemeContextType, Theme, FontSize, FontFamily } from "@/types/theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

// Create a default context with required properties
const defaultThemeContext: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
  toggleTheme: () => {},
  isDark: false,
  isDarkMode: false,
  fontSize: "md",
  setFontSize: () => {},
  fontFamily: "sans",
  setFontFamily: () => {},
  systemTheme: "light",
  soundEnabled: false,
  reduceMotion: false,
  setSoundEnabled: () => {},
  setReduceMotion: () => {}
};

export const ThemeProviderContext = createContext<ThemeContextType>(defaultThemeContext);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Derived state
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const isDark = isDarkMode; // Alias

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      setSystemTheme(systemTheme);
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme,
    isDark,
    isDarkMode, 
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    systemTheme,
    soundEnabled,
    setSoundEnabled,
    reduceMotion,
    setReduceMotion
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
