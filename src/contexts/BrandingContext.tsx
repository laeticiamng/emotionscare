
import React, { createContext, useContext, useState } from 'react';
import { Recommendation } from '@/types';

interface BrandingContextType {
  brandingTheme: string;
  emotionalTone: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  setBrandingTheme: (theme: string) => void;
  setEmotionalTone: (tone: string) => void;
  updateColors: (colors: {
    primary: string;
    secondary: string;
    accent: string;
  }) => void;
}

const defaultColors = {
  primary: '#6366f1',
  secondary: '#a855f7',
  accent: '#ec4899'
};

const BrandingContext = createContext<BrandingContextType>({
  brandingTheme: 'modern',
  emotionalTone: 'positive',
  colors: defaultColors,
  setBrandingTheme: () => {},
  setEmotionalTone: () => {},
  updateColors: () => {}
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandingTheme, setBrandingTheme] = useState('modern');
  const [emotionalTone, setEmotionalTone] = useState('positive');
  const [colors, setColors] = useState(defaultColors);

  const updateColors = (newColors: typeof defaultColors) => {
    setColors(newColors);
  };

  return (
    <BrandingContext.Provider 
      value={{ 
        brandingTheme, 
        emotionalTone, 
        colors,
        setBrandingTheme,
        setEmotionalTone,
        updateColors
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
