
import React, { createContext, useContext, useEffect, useState } from "react";
import { UserPreferences } from '@/types/preferences';

export type ThemeName = 'light' | 'dark' | 'system' | 'pastel';

export interface Theme {
  name: string;
  value: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: ThemeName) => void;
  systemTheme: 'dark' | 'light';
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const themes: Theme[] = [
  {
    name: "Light",
    value: "light",
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#8b5cf6",
      background: "#ffffff",
      text: "#1f2937"
    }
  },
  {
    name: "Dark",
    value: "dark",
    colors: {
      primary: "#60a5fa",
      secondary: "#34d399",
      accent: "#a78bfa",
      background: "#111827",
      text: "#f3f4f6"
    }
  },
  {
    name: "System",
    value: "system",
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#8b5cf6",
      background: "#ffffff",
      text: "#1f2937"
    }
  },
  {
    name: "Pastel",
    value: "pastel",
    colors: {
      primary: "#a5b4fc",
      secondary: "#a7f3d0",
      accent: "#ddd6fe",
      background: "#f5f7ff",
      text: "#4b5563"
    }
  }
];

const getDefaultTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme") as ThemeName;
  if (savedTheme && themes.find((t) => t.value === savedTheme)) {
    return themes.find((t) => t.value === savedTheme) || themes[0];
  }

  return themes[0]; // Default to light theme
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getDefaultTheme());
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light');
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "system",
    soundEnabled: true,
    autoplayMedia: true,
    reduceMotion: false,
    colorBlindMode: false
  });
  
  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const listener = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Apply theme to document
  useEffect(() => {
    let effectiveTheme = theme;
    
    if (theme.value === "system") {
      effectiveTheme = themes.find((t) => t.value === systemTheme) || themes[0];
    }
    
    document.documentElement.classList.remove("light", "dark", "pastel");
    document.documentElement.classList.add(effectiveTheme.value);
    
    localStorage.setItem("theme", theme.value);
  }, [theme, systemTheme]);

  const setTheme = (themeName: ThemeName) => {
    const newTheme = themes.find((t) => t.value === themeName) || themes[0];
    setThemeState(newTheme);
    updatePreferences({ theme: themeName });
  };

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    
    // Apply theme if it's being updated
    if (newPreferences.theme) {
      setTheme(newPreferences.theme as ThemeName);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        systemTheme,
        preferences,
        updatePreferences
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
