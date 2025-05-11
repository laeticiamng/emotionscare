
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

interface BrandingContextType {
  logo: string | null;
  name: string;
  themeColors: ThemeColors;
  setLogo: (logo: string | null) => void;
  setName: (name: string) => void;
  setThemeColors: (colors: Partial<ThemeColors>) => void;
  applyEmotionalBranding: (emotion: string) => void;
}

const defaultThemeColors: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#8b5cf6',
  background: '#ffffff',
  text: '#1f2937'
};

const defaultContext: BrandingContextType = {
  logo: null,
  name: 'EmotionsCare',
  themeColors: defaultThemeColors,
  setLogo: () => {},
  setName: () => {},
  setThemeColors: () => {},
  applyEmotionalBranding: () => {}
};

const BrandingContext = createContext<BrandingContextType>(defaultContext);

interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [name, setName] = useState('EmotionsCare');
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultThemeColors);

  const updateThemeColors = (colors: Partial<ThemeColors>) => {
    setThemeColors(current => ({ ...current, ...colors }));
    
    // Application des couleurs aux variables CSS
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        document.documentElement.style.setProperty(`--brand-${key}`, value);
      }
    });
  };

  const applyEmotionalBranding = (emotion: string) => {
    // Ajuster les couleurs en fonction de l'émotion
    switch (emotion.toLowerCase()) {
      case 'calm':
        updateThemeColors({
          primary: '#4f46e5',
          secondary: '#0ea5e9',
          accent: '#7dd3fc'
        });
        break;
      case 'energetic':
        updateThemeColors({
          primary: '#f97316',
          secondary: '#fbbf24',
          accent: '#fcd34d'
        });
        break;
      case 'creative':
        updateThemeColors({
          primary: '#8b5cf6',
          secondary: '#ec4899',
          accent: '#f472b6'
        });
        break;
      case 'reflective':
        updateThemeColors({
          primary: '#10b981',
          secondary: '#0d9488',
          accent: '#2dd4bf'
        });
        break;
      case 'anxious':
        updateThemeColors({
          primary: '#7c3aed',
          secondary: '#4f46e5',
          accent: '#818cf8'
        });
        break;
      default:
        // Revenir aux couleurs par défaut
        updateThemeColors(defaultThemeColors);
    }
  };

  return (
    <BrandingContext.Provider
      value={{
        logo,
        name,
        themeColors,
        setLogo,
        setName,
        setThemeColors: updateThemeColors,
        applyEmotionalBranding
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
