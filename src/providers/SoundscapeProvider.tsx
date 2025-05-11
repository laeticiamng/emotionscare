
import React, { createContext, useContext, useState } from 'react';

type SoundscapeType = 'nature' | 'urban' | 'meditation' | 'focus' | 'none';
type SoundVolume = 'low' | 'medium' | 'high' | 'mute';

interface SoundscapeContextType {
  soundscapeType: SoundscapeType;
  setSoundscapeType: (type: SoundscapeType) => void;
  volume: SoundVolume;
  setVolume: (volume: SoundVolume) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  playFunctionalSound: (soundType: 'success' | 'error' | 'notification' | 'click' | 'transition') => void;
  updateSoundscapeForEmotion?: (emotion: string) => void;
}

const SoundscapeContext = createContext<SoundscapeContextType>({
  soundscapeType: 'none',
  setSoundscapeType: () => {},
  volume: 'medium',
  setVolume: () => {},
  isPlaying: false,
  togglePlay: () => {},
  playFunctionalSound: () => {}
});

export const SoundscapeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundscapeType, setSoundscapeType] = useState<SoundscapeType>('none');
  const [volume, setVolume] = useState<SoundVolume>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const playFunctionalSound = (soundType: 'success' | 'error' | 'notification' | 'click' | 'transition') => {
    // Mock implementation - would play a sound based on type
    console.log(`Playing ${soundType} sound`);
  };
  
  const updateSoundscapeForEmotion = (emotion: string) => {
    console.log(`Updating soundscape for emotion: ${emotion}`);
    // Map emotions to soundscape types
    const emotionToSoundscape: Record<string, SoundscapeType> = {
      'happy': 'nature',
      'calm': 'meditation',
      'focused': 'focus',
      'neutral': 'nature'
    };
    
    const newType = emotionToSoundscape[emotion.toLowerCase()] || 'nature';
    setSoundscapeType(newType);
  };
  
  return (
    <SoundscapeContext.Provider value={{
      soundscapeType,
      setSoundscapeType,
      volume,
      setVolume,
      isPlaying,
      togglePlay,
      playFunctionalSound,
      updateSoundscapeForEmotion
    }}>
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);
