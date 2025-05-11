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
  updateSoundscapeForEmotion: (emotion: string) => void;
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
  const { brandingTheme } = useBranding();
  
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
  const updateSoundscapeForEmotion = useCallback((emotion: string) => {
    if (!isEnabled) return;
    
    console.log(`Updating soundscape for emotion: ${emotion}`);
    
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
    
    // Also adjust volume based on emotion intensity
    const intensityMap: Record<string, number> = {
      'excited': 0.8,
      'energetic': 0.7,
      'happy': 0.65,
      'focused': 0.6,
      'creative': 0.6,
      'calm': 0.5,
      'relaxed': 0.4,
      'sad': 0.4,
      'anxious': 0.5,
      'stressed': 0.5
    };
    
    const newVolume = intensityMap[emotion.toLowerCase()] || 0.5;
    setVolume(newVolume);
    
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
