
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BrandingTheme = 'standard' | 'premium' | 'ultra-premium';
export type EmotionalTone = 'neutral' | 'calming' | 'energetic' | 'creative' | 'focused';

interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
}

interface BrandingContextType {
  brandingTheme: BrandingTheme;
  setBrandingTheme: (theme: BrandingTheme) => void;
  emotionalTone: EmotionalTone;
  setEmotionalTone: (tone: EmotionalTone) => void;
  colors: Colors;
  setColors: (colors: Colors) => void;
}

const defaultColors: Colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  highlight: '#f59e0b'
};

const BrandingContext = createContext<BrandingContextType>({
  brandingTheme: 'standard',
  setBrandingTheme: () => {},
  emotionalTone: 'neutral',
  setEmotionalTone: () => {},
  colors: defaultColors,
  setColors: () => {}
});

interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [brandingTheme, setBrandingTheme] = useState<BrandingTheme>('standard');
  const [emotionalTone, setEmotionalTone] = useState<EmotionalTone>('neutral');
  const [colors, setColors] = useState<Colors>(defaultColors);

  return (
    <BrandingContext.Provider
      value={{
        brandingTheme,
        setBrandingTheme,
        emotionalTone,
        setEmotionalTone,
        colors,
        setColors
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
