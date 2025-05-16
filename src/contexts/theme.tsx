
import React, { createContext, useState, useContext, useEffect } from 'react';

// Types de thèmes possibles
export type Theme = "light" | "dark" | "system";
export type FontFamily = "sans" | "serif" | "mono";
export type FontSize = "sm" | "md" | "lg";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  fontFamily: "sans",
  setFontFamily: () => {},
  fontSize: "md", 
  setFontSize: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get from localStorage or default to system
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme;
      return storedTheme || "system";
    }
    return "system";
  });
  
  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    if (typeof window !== "undefined") {
      const storedFont = localStorage.getItem("fontFamily") as FontFamily;
      return storedFont || "sans";
    }
    return "sans";
  });
  
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    if (typeof window !== "undefined") {
      const storedSize = localStorage.getItem("fontSize") as FontSize;
      return storedSize || "md";
    }
    return "md";
  });

  // Update the theme when the state changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.remove("dark", "light");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("dark", "light");
      root.classList.add(theme);
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  // Update font family
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all font classes and add the selected one
    root.classList.remove("font-sans", "font-serif", "font-mono");
    root.classList.add(`font-${fontFamily}`);
    
    localStorage.setItem("fontFamily", fontFamily);
  }, [fontFamily]);
  
  // Update font size
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all size classes and add the selected one
    root.classList.remove("text-sm", "text-base", "text-lg");
    
    if (fontSize === "sm") root.classList.add("text-sm");
    if (fontSize === "lg") root.classList.add("text-lg");
    // Medium is the default, no class needed
    
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // Custom setters with localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const setFontFamily = (newFont: FontFamily) => {
    setFontFamilyState(newFont);
  };
  
  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      fontFamily, 
      setFontFamily, 
      fontSize, 
      setFontSize 
    }}>
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
