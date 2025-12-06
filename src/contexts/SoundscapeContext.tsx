// @ts-nocheck

import React, { createContext, useContext, useState } from 'react';

interface SoundscapeContextType {
  soundscapeType: string;
  setSoundscapeType: (type: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  playFunctionalSound: (soundType: string) => void;
}

const SoundscapeContext = createContext<SoundscapeContextType>({
  soundscapeType: 'calm',
  setSoundscapeType: () => {},
  volume: 50,
  setVolume: () => {},
  isPlaying: false,
  togglePlay: () => {},
  playFunctionalSound: () => {}
});

export const SoundscapeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundscapeType, setSoundscapeType] = useState('calm');
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playFunctionalSound = (soundType: string) => {
    // Play functional sound - silent logging
    // Logic to play different UI sounds would go here
  };

  return (
    <SoundscapeContext.Provider 
      value={{ 
        soundscapeType, 
        setSoundscapeType, 
        volume, 
        setVolume, 
        isPlaying, 
        togglePlay,
        playFunctionalSound 
      }}
    >
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);
