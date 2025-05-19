
"use client";

import * as React from "react";
import { ThemeContextType, Theme, FontSize, FontFamily } from "@/types/theme";

const ThemeContext = React.createContext<ThemeContextType>({
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
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark" | "system" | "pastel";
}) {
  const [theme, setTheme] = React.useState<
    "light" | "dark" | "system" | "pastel"
  >(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("theme") as
          | "light"
          | "dark"
          | "system"
          | "pastel") || defaultTheme
      );
    }
    return defaultTheme;
  });

  const [fontSize, setFontSize] = React.useState<FontSize>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fontSize") as FontSize) || "md";
    }
    return "md";
  });

  const [fontFamily, setFontFamily] = React.useState<FontFamily>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fontFamily") as FontFamily) || "sans";
    }
    return "sans";
  });

  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("light");

  const isDarkMode = React.useMemo(() => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)")
          .matches;
        return systemPrefersDark;
      }
      return false;
    }
    return theme === "dark";
  }, [theme]);

  // Alias for isDarkMode
  const isDark = isDarkMode;

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      return newTheme;
    });
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const systemThemeValue = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      setSystemTheme(systemThemeValue);
      root.classList.remove("light", "dark");
      root.classList.add(systemThemeValue);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDarkMode,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        isDark,
        soundEnabled: true,
        reduceMotion: false,
        setSoundEnabled: () => {},
        setReduceMotion: () => {},
        systemTheme,
      }}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
