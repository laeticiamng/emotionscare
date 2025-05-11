
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SoundscapeContextType {
  soundscapeType: string;
  updateSoundscapeForEmotion: (emotion: string) => void;
}

const SoundscapeContext = createContext<SoundscapeContextType>({
  soundscapeType: 'ambient',
  updateSoundscapeForEmotion: () => {}
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

  return (
    <SoundscapeContext.Provider 
      value={{ 
        soundscapeType, 
        updateSoundscapeForEmotion 
      }}
    >
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);
