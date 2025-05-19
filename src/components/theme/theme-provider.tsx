
import { createContext, useEffect, useState } from "react";
import { ThemeContextType, Theme, FontSize } from "@/types/theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

// Create a default context with required properties
const defaultThemeContext: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
  fontSize: "md",
  setFontSize: () => {},
  systemTheme: "light",
  isDarkMode: false,
  soundEnabled: false,
  reduceMotion: false,
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
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

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
    fontSize,
    setFontSize,
    systemTheme,
    soundEnabled: false,
    reduceMotion: false,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
