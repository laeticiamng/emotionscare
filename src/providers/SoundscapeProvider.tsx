
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
  playFunctionalSound: (soundType: 'success' | 'error' | 'notification' | 'click') => void;
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
  
  const playFunctionalSound = (soundType: 'success' | 'error' | 'notification' | 'click') => {
    // Mock implementation - would play a sound based on type
    console.log(`Playing ${soundType} sound`);
  };
  
  return (
    <SoundscapeContext.Provider value={{
      soundscapeType,
      setSoundscapeType,
      volume,
      setVolume,
      isPlaying,
      togglePlay,
      playFunctionalSound
    }}>
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);
