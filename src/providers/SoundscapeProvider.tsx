
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useBranding } from '@/contexts/BrandingContext';

type SoundscapeType = 'ambient' | 'nature' | 'minimal' | 'focus' | 'urban' | 'none';

interface SoundscapeContextType {
  soundscapeType: SoundscapeType;
  volume: number;
  isMuted: boolean;
  isEnabled: boolean;
  setSoundscapeType: (type: SoundscapeType) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleEnabled: () => void;
  playEmotionalResponse: (emotion: string) => void;
  playFunctionalSound: (type: 'success' | 'error' | 'notification' | 'transition') => void;
  updateSoundscapeForEmotion: (emotion: string, intensity?: number) => void;
}

const SoundscapeContext = createContext<SoundscapeContextType>({
  soundscapeType: 'ambient',
  volume: 0.5,
  isMuted: false,
  isEnabled: true,
  setSoundscapeType: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  toggleEnabled: () => {},
  playEmotionalResponse: () => {},
  playFunctionalSound: () => {},
  updateSoundscapeForEmotion: () => {}
});

export const useSoundscape = () => useContext(SoundscapeContext);

export const SoundscapeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundscapeType, setSoundscapeType] = useState<SoundscapeType>('ambient');
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const { brandingTheme, updatePalette } = useBranding();
  
  // Toggle mute state
  const toggleMute = () => setIsMuted(!isMuted);
  
  // Toggle soundscape enabled state
  const toggleEnabled = () => setIsEnabled(!isEnabled);
  
  // Play a sound response based on emotion
  const playEmotionalResponse = useCallback((emotion: string) => {
    if (!isEnabled || isMuted) return;
    
    console.log(`Playing emotional response for: ${emotion}`);
    // Implementation would use Web Audio API or a sound library
    
    // For demonstration purposes, we'll adjust the soundscape instead
    const emotionToSoundscape: Record<string, SoundscapeType> = {
      'happy': 'nature',
      'calm': 'ambient',
      'focused': 'focus',
      'energetic': 'urban',
      'creative': 'nature',
      'sad': 'minimal',
      'anxious': 'ambient',
      'stressed': 'ambient'
    };
    
    const newSoundscape = emotionToSoundscape[emotion.toLowerCase()] || 'ambient';
    setSoundscapeType(newSoundscape);
    
  }, [isEnabled, isMuted]);
  
  // Play functional UI sounds
  const playFunctionalSound = useCallback((type: 'success' | 'error' | 'notification' | 'transition') => {
    if (!isEnabled || isMuted) return;
    
    console.log(`Playing functional sound: ${type}`);
    // Implementation would play appropriate sound based on type
    
  }, [isEnabled, isMuted]);
  
  // Update soundscape based on predicted or detected emotion
  const updateSoundscapeForEmotion = useCallback((emotion: string, intensity: number = 100) => {
    if (!isEnabled) return;
    
    console.log(`Updating soundscape for emotion: ${emotion} (intensity: ${intensity})`);
    
    // Map emotions to appropriate soundscapes
    const emotionToSoundscape: Record<string, SoundscapeType> = {
      'happy': 'nature',
      'joy': 'nature',
      'calm': 'ambient',
      'relaxed': 'ambient',
      'focused': 'focus',
      'creative': 'nature',
      'sad': 'minimal',
      'anxious': 'ambient',
      'stressed': 'ambient',
      'energetic': 'urban',
      'excited': 'urban'
    };
    
    // Apply the mapped soundscape
    const newSoundscape = emotionToSoundscape[emotion.toLowerCase()] || 'ambient';
    setSoundscapeType(newSoundscape);
    
    // Also adjust volume based on intensity
    const normalizedIntensity = Math.min(Math.max(intensity, 0), 100) / 100;
    setVolume(normalizedIntensity * 0.7 + 0.3); // Range between 0.3 and 1.0
    
  }, [isEnabled]);
  
  // Apply branding-appropriate soundscape when branding changes
  useEffect(() => {
    const brandingToSoundscape: Record<string, SoundscapeType> = {
      'minimal': 'minimal',
      'standard': 'ambient',
      'premium': 'focus',
      'ultra-premium': 'nature'
    };
    
    setSoundscapeType(brandingToSoundscape[brandingTheme] || 'ambient');
    
  }, [brandingTheme]);
  
  return (
    <SoundscapeContext.Provider value={{
      soundscapeType,
      volume,
      isMuted,
      isEnabled,
      setSoundscapeType,
      setVolume,
      toggleMute,
      toggleEnabled,
      playEmotionalResponse,
      playFunctionalSound,
      updateSoundscapeForEmotion
    }}>
      {children}
    </SoundscapeContext.Provider>
  );
};

export default SoundscapeProvider;
