
import React, { createContext, useState, useEffect } from "react";
import { ThemeContextType, ThemeName, FontSize, FontFamily } from "@/types/theme";

// Create the context and export it
export const ThemeProviderContext = createContext<ThemeContextType>({
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
  reduceMotion: false,
  setReduceMotion: () => {},
  soundEnabled: false,
  setSoundEnabled: () => {}
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>(
    () => {
      try {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system' || storedTheme === 'pastel')) {
          return storedTheme as ThemeName;
        }
      } catch (error) {
        console.error('Error reading localStorage:', error);
      }
      return defaultTheme;
    }
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
    setTheme(prevTheme => 
      prevTheme === 'dark' ? 'light' : 
      prevTheme === 'light' ? 'system' : 'dark'
    );
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      setSystemTheme(systemTheme === "dark" ? "dark" : "light");
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme: (newTheme: ThemeName) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
      setTheme(newTheme);
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

// Export the hook for using the theme
export function useTheme() {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
