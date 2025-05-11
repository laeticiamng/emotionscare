
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useMusic } from '@/contexts/MusicContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

// Define the branding theme types
type BrandingTheme = 'standard' | 'premium' | 'ultra-premium' | 'minimal';
type EmotionalTone = 'neutral' | 'energetic' | 'calm' | 'focused' | 'joyful' | 'reflective';
type VisualDensity = 'compact' | 'balanced' | 'spacious';
type AnimationLevel = 'minimal' | 'subtle' | 'dynamic';

interface BrandColor {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
}

interface BrandingContextType {
  brandingTheme: BrandingTheme;
  emotionalTone: EmotionalTone;
  visualDensity: VisualDensity;
  animationLevel: AnimationLevel;
  colors: BrandColor;
  soundEnabled: boolean;
  brandName: string;
  setBrandingTheme: (theme: BrandingTheme) => void;
  setEmotionalTone: (tone: EmotionalTone) => void;
  setVisualDensity: (density: VisualDensity) => void;
  setAnimationLevel: (level: AnimationLevel) => void;
  toggleSound: () => void;
  applyEmotionalBranding: (emotion: string) => void;
}

const defaultColors: BrandColor = {
  primary: '#9b87f5',
  secondary: '#7E69AB',
  accent: '#6E59A5', 
  highlight: '#D6BCFA',
}

const emotionColorMap: Record<EmotionalTone, BrandColor> = {
  neutral: defaultColors,
  energetic: {
    primary: '#F97316',  
    secondary: '#FB923C',
    accent: '#FDBA74',   
    highlight: '#FED7AA',
  },
  calm: {
    primary: '#3B82F6',  
    secondary: '#60A5FA',
    accent: '#93C5FD',   
    highlight: '#BFDBFE',
  },
  focused: {
    primary: '#8B5CF6',  
    secondary: '#A78BFA',
    accent: '#C4B5FD',   
    highlight: '#DDD6FE',
  },
  joyful: {
    primary: '#FBBF24',  
    secondary: '#FCD34D',
    accent: '#FDE68A',   
    highlight: '#FEF3C7',
  },
  reflective: {
    primary: '#6B7280',  
    secondary: '#9CA3AF',
    accent: '#D1D5DB',   
    highlight: '#E5E7EB',
  }
};

const BrandingContext = createContext<BrandingContextType>({
  brandingTheme: 'premium',
  emotionalTone: 'neutral',
  visualDensity: 'balanced',
  animationLevel: 'subtle',
  colors: defaultColors,
  soundEnabled: true,
  brandName: 'EmotionsCare',
  setBrandingTheme: () => {},
  setEmotionalTone: () => {},
  setVisualDensity: () => {},
  setAnimationLevel: () => {},
  toggleSound: () => {},
  applyEmotionalBranding: () => {},
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { userMode } = useUserMode();
  const { user } = useAuth();
  const { loadPlaylistForEmotion } = useMusic();
  
  const [brandingTheme, setBrandingTheme] = useState<BrandingTheme>(
    userMode === 'b2b-admin' ? 'ultra-premium' : 'premium'
  );
  const [emotionalTone, setEmotionalTone] = useState<EmotionalTone>('neutral');
  const [visualDensity, setVisualDensity] = useState<VisualDensity>('balanced');
  const [animationLevel, setAnimationLevel] = useState<AnimationLevel>('subtle');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [colors, setColors] = useState<BrandColor>(defaultColors);
  
  // Apply branding based on user preferences
  useEffect(() => {
    // Determine if we should use ultra-premium branding for B2B admin
    if (userMode === 'b2b-admin') {
      setBrandingTheme('ultra-premium');
      setVisualDensity('spacious');
      setAnimationLevel('dynamic');
    } else if (userMode === 'b2b-collaborator') {
      setBrandingTheme('premium');
    }
    
    // Update colors based on theme
    const baseColors = emotionColorMap[emotionalTone];
    if (theme === 'dark') {
      setColors({
        ...baseColors,
        primary: baseColors.primary,
        secondary: baseColors.secondary,
      });
    } else {
      setColors(baseColors);
    }
  }, [userMode, theme, emotionalTone]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Apply emotional branding based on detected emotion
  const applyEmotionalBranding = (emotion: string) => {
    // Map the emotion to our emotional tone
    const emotionToTone: Record<string, EmotionalTone> = {
      happy: 'joyful',
      energetic: 'energetic',
      calm: 'calm',
      focused: 'focused',
      sad: 'reflective',
      neutral: 'neutral',
      anxious: 'calm', // Calming tone for anxious emotion
      stressed: 'calm',
      bored: 'energetic',
      tired: 'calm',
    };
    
    const newTone = emotionToTone[emotion.toLowerCase()] || 'neutral';
    setEmotionalTone(newTone);
    
    // Load appropriate music playlist if sound is enabled
    if (soundEnabled) {
      loadPlaylistForEmotion(emotion.toLowerCase());
    }
    
    // Apply colors from our emotion map
    setColors(emotionColorMap[newTone]);
  };

  return (
    <BrandingContext.Provider value={{
      brandingTheme,
      emotionalTone,
      visualDensity,
      animationLevel,
      colors,
      soundEnabled,
      brandName: 'EmotionsCare',
      setBrandingTheme,
      setEmotionalTone,
      setVisualDensity,
      setAnimationLevel,
      toggleSound,
      applyEmotionalBranding,
    }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);

export default BrandingContext;
