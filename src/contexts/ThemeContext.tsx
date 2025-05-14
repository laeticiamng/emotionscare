
import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme as ThemeType } from "@/types/types";

// Define types for ThemeContext
export type FontSize = "small" | "medium" | "large" | "extra-large";
export type FontFamily = "inter" | "roboto" | "poppins" | "merriweather" | "system";

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontSize?: FontSize;
  setFontSize?: (size: FontSize) => void;
}

// Create ThemeContext with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children,
  defaultTheme = "light" 
}) => {
  // Initialize theme state from localStorage or defaultTheme
  const [theme, setTheme] = useState<ThemeType>(() => {
    const storedTheme = localStorage.getItem("theme");
    return (storedTheme as ThemeType) || defaultTheme;
  });
  
  // Initialize font family from localStorage or default
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    const storedFont = localStorage.getItem("fontFamily");
    return (storedFont as FontFamily) || "inter";
  });
  
  // Initialize font size from localStorage or default
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const storedSize = localStorage.getItem("fontSize");
    return (storedSize as FontSize) || "medium";
  });

  // Update theme in localStorage when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme class
    root.classList.remove("light", "dark");
    
    // Add new theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Update font family in DOM when it changes
  useEffect(() => {
    const body = window.document.body;
    
    // Remove existing font family classes
    body.classList.remove(
      "font-inter", 
      "font-roboto", 
      "font-poppins", 
      "font-merriweather", 
      "font-system"
    );
    
    // Add new font family class
    body.classList.add(`font-${fontFamily}`);
    
    // Save to localStorage
    localStorage.setItem("fontFamily", fontFamily);
  }, [fontFamily]);

  // Update font size in DOM when it changes
  useEffect(() => {
    const html = window.document.documentElement;
    
    // Remove existing font size classes
    html.classList.remove(
      "text-sm", // small
      "text-base", // medium
      "text-lg", // large
      "text-xl" // extra-large
    );
    
    // Add new font size class based on selected size
    switch (fontSize) {
      case "small":
        html.classList.add("text-sm");
        break;
      case "medium":
        html.classList.add("text-base");
        break;
      case "large":
        html.classList.add("text-lg");
        break;
      case "extra-large":
        html.classList.add("text-xl");
        break;
    }
    
    // Save to localStorage
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

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

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
