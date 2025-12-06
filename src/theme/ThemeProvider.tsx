"use client";
import React from "react";

type Theme = "light" | "dark" | "system";
const ThemeCtx = React.createContext<{theme: Theme; setTheme: (t: Theme)=>void}>({theme:"system", setTheme:()=>{}});

function getSystemPref(): "light"|"dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("system");

  React.useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    if (stored) setTheme(stored);
  }, []);

  React.useEffect(() => {
    const resolved = theme === "system" ? getSystemPref() : theme;
    document.documentElement.setAttribute("data-theme", resolved);
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() { return React.useContext(ThemeCtx); }

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const label = theme === "light" ? "Passer en sombre" : theme === "dark" ? "Thème système" : "Passer en clair";
  return (
    <button aria-label={label} onClick={() => setTheme(next)} style={{ padding: 8, borderRadius: 10 }}>
      {theme === "light" ? "🌞" : theme === "dark" ? "🌚" : "💻"}
    </button>
  );
}
