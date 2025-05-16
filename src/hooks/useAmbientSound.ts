
import { useState, useEffect, useRef } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface UseAmbientSoundOptions {
  defaultVolume?: number;
  autoPlay?: boolean;
}

export function useAmbientSound(soundUrl: string, options: UseAmbientSoundOptions = {}) {
  const { defaultVolume = 0.3, autoPlay = false } = options;
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(defaultVolume);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { preferences } = useUserPreferences();
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(soundUrl);
    audio.loop = true;
    audio.volume = volume;
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
      if (autoPlay && preferences?.ambientSound !== false) {
        audio.play().catch(err => {
          console.error('Failed to autoplay ambient sound:', err);
          setError('Autoplay blocked by browser. Click to play.');
        });
      }
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Error loading ambient sound:', e);
      setError('Failed to load ambient sound');
    });
    
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.remove();
      audioRef.current = null;
    };
  }, [soundUrl, autoPlay, volume, preferences?.ambientSound]);
  
  // Play/pause controls
  const play = () => {
    if (!audioRef.current || !isLoaded) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to play ambient sound:', err);
        setError('Playback blocked by browser');
        setIsPlaying(false);
      });
  };
  
  const pause = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  // Volume control
  const adjustVolume = (value: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, value));
    audioRef.current.volume = clampedVolume;
    setVolume(clampedVolume);
  };

  return {
    isPlaying,
    isLoaded,
    error,
    volume,
    play,
    pause,
    toggle,
    adjustVolume,
    audioRef
  };
}

export default useAmbientSound;
