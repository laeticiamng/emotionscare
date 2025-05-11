
import React, { createContext, useContext, useState, useEffect } from 'react';

// Updated to include all possible theme options
type Theme = 'light' | 'dark' | 'system' | 'pastel';
type FontSize = 'small' | 'medium' | 'large';
type FontFamily = 'default' | 'serif' | 'mono' | 'inter' | 'roboto' | 'poppins' | 'montserrat';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemePreference: (theme: Theme) => void; // Added for backward compatibility
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Récupérer le thème du localStorage s'il existe
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily;
    return savedFontFamily || 'inter';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    return savedFontSize || 'medium';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Enregistrer la préférence dans localStorage
    localStorage.setItem('theme', theme);
    
    // Appliquer la classe dark au document si nécessaire
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply theme-specific classes
    root.classList.remove('light', 'dark', 'system', 'pastel');
    root.classList.add(theme);
    
    console.log('Theme updated:', theme);
  }, [theme]);

  // Save font preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    console.log('Font family updated:', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    console.log('Font size updated:', fontSize);
  }, [fontSize]);

  // Create setThemePreference as an alias for setTheme for backward compatibility
  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      setThemePreference, 
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
    console.warn("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Export types for use in other files
export type { Theme, FontSize, FontFamily };
