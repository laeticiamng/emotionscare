
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
  applyEmotionalBranding?: (emotion: string) => void;
  logoUrl?: string; // Added missing property
  companyName?: string; // Added missing property
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
  setColors: () => {},
  logoUrl: '/logo.svg', // Default logo
  companyName: 'EmotionsCare' // Default company name
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandingTheme, setBrandingTheme] = useState<BrandingTheme>('standard');
  const [emotionalTone, setEmotionalTone] = useState<EmotionalTone>('neutral');
  const [colors, setColorsState] = useState<BrandingColors>(defaultColors);
  const [logoUrl, setLogoUrl] = useState<string>('/logo.svg');
  const [companyName, setCompanyName] = useState<string>('EmotionsCare');
  
  const setColors = (newColors: Partial<BrandingColors>) => {
    setColorsState(prev => ({ ...prev, ...newColors }));
  };
  
  const applyEmotionalBranding = (emotion: string) => {
    // Map emotions to visual branding tones
    const emotionToTone: Record<string, EmotionalTone> = {
      'happy': 'energetic',
      'calm': 'calm',
      'focused': 'focused',
      'creative': 'creative',
      'neutral': 'neutral'
    };
    
    const tone = emotionToTone[emotion.toLowerCase()] || 'neutral';
    setEmotionalTone(tone);
    
    // Apply color palette based on tone
    const emotionColors: Record<EmotionalTone, Partial<BrandingColors>> = {
      'energetic': {
        primary: '#ef4444',
        highlight: '#f97316'
      },
      'calm': {
        primary: '#3b82f6',
        highlight: '#06b6d4'
      },
      'focused': {
        primary: '#8b5cf6',
        highlight: '#6366f1'
      },
      'creative': {
        primary: '#ec4899',
        highlight: '#d946ef'
      },
      'neutral': {
        primary: '#4f46e5',
        highlight: '#ec4899'
      }
    };
    
    setColors(emotionColors[tone]);
  };
  
  return (
    <BrandingContext.Provider value={{
      brandingTheme,
      emotionalTone,
      colors,
      setBrandingTheme,
      setEmotionalTone,
      setColors,
      applyEmotionalBranding,
      logoUrl,
      companyName
    }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
