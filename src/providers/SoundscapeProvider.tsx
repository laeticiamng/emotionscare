
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type SoundscapeType = 'focus' | 'relax' | 'creative' | 'energize' | 'calm' | 'meditate';

interface SoundscapeContextType {
  currentSoundscape: SoundscapeType | null;
  isPlaying: boolean;
  volume: number;
  playSoundscape: (type: SoundscapeType) => void;
  pauseSoundscape: () => void;
  setVolume: (volume: number) => void;
  updateSoundscapeForEmotion: (emotion: string) => void;
}

const defaultSoundscapeContext: SoundscapeContextType = {
  currentSoundscape: null,
  isPlaying: false,
  volume: 0.3,
  playSoundscape: () => {},
  pauseSoundscape: () => {},
  setVolume: () => {},
  updateSoundscapeForEmotion: () => {}
};

const SoundscapeContext = createContext<SoundscapeContextType>(defaultSoundscapeContext);

interface SoundscapeProviderProps {
  children: ReactNode;
}

export const SoundscapeProvider: React.FC<SoundscapeProviderProps> = ({ children }) => {
  const [currentSoundscape, setCurrentSoundscape] = useState<SoundscapeType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const playSoundscape = useCallback((type: SoundscapeType) => {
    console.log(`Playing soundscape: ${type}`);
    setCurrentSoundscape(type);
    setIsPlaying(true);
    
    // Logique pour jouer le soundscape (dans une implémentation réelle)
  }, []);

  const pauseSoundscape = useCallback(() => {
    console.log('Pausing soundscape');
    setIsPlaying(false);
    
    // Logique pour mettre en pause le soundscape
  }, []);

  const updateSoundscapeForEmotion = useCallback((emotion: string) => {
    // Mapper l'émotion à un type de soundscape approprié
    let soundscape: SoundscapeType;
    
    switch (emotion.toLowerCase()) {
      case 'calm':
      case 'relaxed':
      case 'peaceful':
        soundscape = 'relax';
        break;
      case 'focused':
      case 'concentrated':
        soundscape = 'focus';
        break;
      case 'creative':
      case 'inspired':
        soundscape = 'creative';
        break;
      case 'energetic':
      case 'motivated':
        soundscape = 'energize';
        break;
      case 'anxious':
      case 'stressed':
        soundscape = 'meditate';
        break;
      default:
        soundscape = 'calm';
    }
    
    console.log(`Updating soundscape for emotion: ${emotion} -> ${soundscape}`);
    playSoundscape(soundscape);
  }, [playSoundscape]);

  return (
    <SoundscapeContext.Provider
      value={{
        currentSoundscape,
        isPlaying,
        volume,
        playSoundscape,
        pauseSoundscape,
        setVolume,
        updateSoundscapeForEmotion
      }}
    >
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);
