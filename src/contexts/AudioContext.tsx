
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  volume: number;
  currentTrackName: string | null;
  setCurrentTrack: (trackName: string | null) => void;
}

const defaultAudioContext: AudioContextType = {
  isPlaying: false,
  togglePlay: () => {},
  setVolume: () => {},
  volume: 0.5,
  currentTrackName: null,
  setCurrentTrack: () => {},
};

export const AudioContext = createContext<AudioContextType>(defaultAudioContext);

export const useAudio = () => useContext(AudioContext);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrackName, setCurrentTrackName] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { soundEnabled } = useTheme();
  
  // Définir les pistes audio disponibles
  const tracks = {
    ambient: '/sounds/ambient.mp3',
    focus: '/sounds/focus-flow.mp3',
    relax: '/sounds/evening-relax.mp3',
    energy: '/sounds/morning-energy.mp3'
  };
  
  useEffect(() => {
    // Initialiser l'élément audio
    const audio = new Audio();
    setAudioElement(audio);
    
    // Définir les comportements par défaut
    audio.volume = volume;
    audio.loop = true;
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Synchroniser avec le paramètre de son activé
  useEffect(() => {
    if (!audioElement) return;
    
    if (!soundEnabled && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    }
  }, [soundEnabled, audioElement, isPlaying]);
  
  const togglePlay = () => {
    if (!audioElement) return;
    
    if (!soundEnabled) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      // S'il n'y a pas de piste active, charger la piste par défaut
      if (!audioElement.src || audioElement.src.endsWith('/')) {
        setCurrentTrack('ambient');
        audioElement.src = tracks.ambient;
      }
      
      audioElement.play().catch(error => {
        console.error('Erreur de lecture audio:', error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const adjustVolume = (newVolume: number) => {
    if (!audioElement) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    audioElement.volume = clampedVolume;
  };
  
  const setCurrentTrack = (trackName: string | null) => {
    if (!audioElement || !trackName) return;
    
    // Vérifier si la piste demandée existe
    if (trackName in tracks) {
      const wasPlaying = !audioElement.paused;
      
      // Sauvegarder la position actuelle
      audioElement.pause();
      
      // Changer la source
      audioElement.src = tracks[trackName as keyof typeof tracks];
      setCurrentTrackName(trackName);
      
      // Reprendre la lecture si elle était active
      if (wasPlaying && soundEnabled) {
        audioElement.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };
  
  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        togglePlay,
        setVolume: adjustVolume,
        volume,
        currentTrackName,
        setCurrentTrack
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
