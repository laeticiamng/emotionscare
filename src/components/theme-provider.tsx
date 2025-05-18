
"use client";

import * as React from "react";
import { ThemeContextType } from "@/types/theme";

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
  isDarkMode: false,
  fontSize: "medium",
  setFontSize: () => {},
  fontFamily: "system",
  setFontFamily: () => {},
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

  const [fontSize, setFontSize] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fontSize") || "medium";
    }
    return "medium";
  });

  const [fontFamily, setFontFamily] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fontFamily") || "system";
    }
    return "system";
  });

  const isDarkMode = React.useMemo(() => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        return systemTheme === "dark";
      }
      return false;
    }
    return theme === "dark";
  }, [theme]);

  // Alias pour isDarkMode
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
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
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
        fontSize: fontSize as any,
        setFontSize: setFontSize as any,
        fontFamily: fontFamily as any,
        setFontFamily: setFontFamily as any,
        isDark
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
