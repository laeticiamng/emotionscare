
import React, { createContext, useContext, useState } from 'react';

type EmotionalTone = 'neutral' | 'calm' | 'energetic' | 'focused' | 'creative';
type BrandingTheme = 'standard' | 'premium' | 'ultra-premium' | 'minimal';

interface BrandingColors {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
}

interface BrandingContextType {
  brandingTheme: BrandingTheme;
  emotionalTone: EmotionalTone;
  colors: BrandingColors;
  setBrandingTheme: (theme: BrandingTheme) => void;
  setEmotionalTone: (tone: EmotionalTone) => void;
  setColors: (colors: Partial<BrandingColors>) => void;
}

const defaultColors: BrandingColors = {
  primary: '#4f46e5',
  secondary: '#10b981',
  accent: '#f59e0b',
  highlight: '#ec4899'
};

const BrandingContext = createContext<BrandingContextType>({
  brandingTheme: 'standard',
  emotionalTone: 'neutral',
  colors: defaultColors,
  setBrandingTheme: () => {},
  setEmotionalTone: () => {},
  setColors: () => {}
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandingTheme, setBrandingTheme] = useState<BrandingTheme>('standard');
  const [emotionalTone, setEmotionalTone] = useState<EmotionalTone>('neutral');
  const [colors, setColorsState] = useState<BrandingColors>(defaultColors);
  
  const setColors = (newColors: Partial<BrandingColors>) => {
    setColorsState(prev => ({ ...prev, ...newColors }));
  };
  
  return (
    <BrandingContext.Provider value={{
      brandingTheme,
      emotionalTone,
      colors,
      setBrandingTheme,
      setEmotionalTone,
      setColors
    }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
