import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeContextType, Theme, FontSize, FontFamily } from "@/types/theme";

const defaultThemeContext: ThemeContextType = {
  theme: "system",
  setTheme: () => {},
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

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  // Calculate derived state
  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark");
  const isDark = isDarkMode;

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    // Handle theme changes
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setSystemTheme(systemPreference);
      root.classList.add(systemPreference);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
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
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
