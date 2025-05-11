
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SoundscapeType = 'none' | 'nature' | 'ambient' | 'focus' | 'relax' | 'productivity';

interface SoundscapeContextType {
  soundscapeType: SoundscapeType;
  setSoundscapeType: (type: SoundscapeType) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  togglePlayback: () => void;
  availableSoundscapes: Array<{
    id: SoundscapeType;
    name: string;
    description: string;
  }>;
}

const SoundscapeContext = createContext<SoundscapeContextType>({
  soundscapeType: 'none',
  setSoundscapeType: () => {},
  volume: 0.5,
  setVolume: () => {},
  isPlaying: false,
  togglePlayback: () => {},
  availableSoundscapes: []
});

export const SoundscapeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [soundscapeType, setSoundscapeType] = useState<SoundscapeType>('none');
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const availableSoundscapes = [
    { 
      id: 'nature' as SoundscapeType, 
      name: 'Nature Sounds', 
      description: 'Peaceful forest and water sounds' 
    },
    { 
      id: 'ambient' as SoundscapeType, 
      name: 'Ambient', 
      description: 'Gentle ambient background music' 
    },
    { 
      id: 'focus' as SoundscapeType, 
      name: 'Focus', 
      description: 'Concentration-enhancing sounds' 
    },
    { 
      id: 'relax' as SoundscapeType, 
      name: 'Relaxation', 
      description: 'Calming sounds for relaxation' 
    },
    { 
      id: 'productivity' as SoundscapeType, 
      name: 'Productivity', 
      description: 'Optimized background for work' 
    }
  ];

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio();
      audioElement.loop = true;
      audioElement.volume = volume;
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, []);

  // Handle soundscape changes
  useEffect(() => {
    if (!audio) return;
    
    // Stop current audio
    audio.pause();
    
    // If no soundscape or not playing, don't start a new one
    if (soundscapeType === 'none' || !isPlaying) {
      return;
    }
    
    // Map soundscape type to audio URL (replace with actual URLs)
    const soundscapeUrls: Record<SoundscapeType, string> = {
      none: '',
      nature: '/audio/nature-forest.mp3',
      ambient: '/audio/ambient-waves.mp3',
      focus: '/audio/focus-beats.mp3',
      relax: '/audio/relax-melody.mp3',
      productivity: '/audio/productivity-rhythm.mp3'
    };
    
    audio.src = soundscapeUrls[soundscapeType];
    audio.load();
    
    if (isPlaying) {
      audio.play().catch(err => console.error('Error playing soundscape:', err));
    }
  }, [soundscapeType, isPlaying, audio]);

  // Handle volume changes
  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audio]);

  return (
    <SoundscapeContext.Provider 
      value={{
        soundscapeType,
        setSoundscapeType,
        volume,
        setVolume,
        isPlaying,
        togglePlayback,
        availableSoundscapes
      }}
    >
      {children}
    </SoundscapeContext.Provider>
  );
};

export const useSoundscape = () => useContext(SoundscapeContext);
