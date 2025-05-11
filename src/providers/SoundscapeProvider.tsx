
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SoundType = 'notification' | 'transition' | 'success' | 'error' | 'ambient';

interface SoundscapeContextType {
  soundscapeType: string;
  updateSoundscapeForEmotion: (emotion: string) => void;
  playFunctionalSound: (type: SoundType) => void;
}

const SoundscapeContext = createContext<SoundscapeContextType>({
  soundscapeType: 'ambient',
  updateSoundscapeForEmotion: () => {},
  playFunctionalSound: () => {}
});

interface SoundscapeProviderProps {
  children: ReactNode;
}

export const SoundscapeProvider: React.FC<SoundscapeProviderProps> = ({ children }) => {
  const [soundscapeType, setSoundscapeType] = useState('ambient');

  const updateSoundscapeForEmotion = (emotion: string) => {
    // Logic to match emotion to soundscape type
    const soundscapeMap: Record<string, string> = {
      'calm': 'ambient',
      'energetic': 'upbeat',
      'creative': 'instrumental',
      'reflective': 'classical',
      'anxious': 'lo-fi'
    };
    
    const newSoundscape = soundscapeMap[emotion.toLowerCase()] || 'ambient';
    setSoundscapeType(newSoundscape);
  };
  
  const playFunctionalSound = (type: SoundType) => {
    // Mock implementation for playing sounds
    console.info(`Playing ${type} sound`);
    
    // In a real app, this would play an actual sound
    // Example: new Audio(`/sounds/${type}.mp3`).play();
  };

  return (
    <SoundscapeContext.Provider 
      value={{ 
        soundscapeType, 
        updateSoundscapeForEmotion,
        playFunctionalSound
      }}
    >
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);
