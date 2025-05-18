
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserPreferences } from '@/contexts/PreferencesContext';

interface Sound {
  name: string;
  src: string;
  volume: number;
}

export const AMBIENT_SOUNDS: Record<string, Sound> = {
  'nature': { 
    name: 'Nature', 
    src: '/sounds/ambient/nature.mp3',
    volume: 0.4 
  },
  'rain': { 
    name: 'Rain', 
    src: '/sounds/ambient/rain.mp3', 
    volume: 0.5 
  },
  'cafe': { 
    name: 'Café', 
    src: '/sounds/ambient/cafe.mp3', 
    volume: 0.3 
  },
  'waves': { 
    name: 'Ocean Waves', 
    src: '/sounds/ambient/waves.mp3', 
    volume: 0.4 
  },
  'fireplace': { 
    name: 'Fireplace', 
    src: '/sounds/ambient/fireplace.mp3', 
    volume: 0.35 
  },
  'none': { 
    name: 'No Sound', 
    src: '', 
    volume: 0 
  },
};

export const useAmbientSound = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { preferences, updatePreferences } = useUserPreferences();
  
  const [currentSound, setCurrentSound] = useState<string>('none');
  const [volume, setVolume] = useState<number>(0.3);
  const [playing, setPlaying] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize ambient sound from user preferences if available
  useEffect(() => {
    if (isAuthenticated && preferences) {
      // Add a fallback if ambientSound is not in preferences
      const savedSound = preferences.ambientSound || 'none';
      if (savedSound !== 'none') {
        setCurrentSound(savedSound);
        setPlaying(true);
      }
    }
  }, [isAuthenticated, preferences]);
  
  // Set up audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle sound changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (currentSound === 'none') {
      audio.pause();
      setPlaying(false);
      return;
    }
    
    const sound = AMBIENT_SOUNDS[currentSound];
    if (!sound) return;
    
    audio.src = sound.src;
    audio.volume = volume * sound.volume;
    
    if (playing) {
      audio.play().catch(err => {
        console.error('Failed to play ambient sound:', err);
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentSound, volume, playing]);
  
  const changeSound = async (soundKey: string) => {
    setCurrentSound(soundKey);
    if (soundKey !== 'none') {
      setPlaying(true);
      
      // Save to user preferences if authenticated
      if (isAuthenticated) {
        await updatePreferences({
          ambientSound: soundKey,
        });
      }
    } else {
      setPlaying(false);
    }
  };
  
  const togglePlay = () => {
    setPlaying(!playing);
  };
  
  const changeVolume = (newVolume: number) => {
    if (audioRef.current) {
      const sound = AMBIENT_SOUNDS[currentSound];
      if (sound) {
        audioRef.current.volume = newVolume * sound.volume;
      }
    }
    setVolume(newVolume);
  };
  
  return {
    playing,
    currentSound,
    volume,
    availableSounds: AMBIENT_SOUNDS,
    changeSound,
    togglePlay,
    changeVolume,
  };
};

export default useAmbientSound;
