
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserPreferences } from '@/types/preferences';

type SoundType = 'rain' | 'forest' | 'ocean' | 'cafe' | 'night' | 'city' | 'fire';

interface AmbientSoundOptions {
  defaultEnabled?: boolean;
  defaultVolume?: number;
  defaultType?: SoundType;
  autoplay?: boolean;
  fadeInDuration?: number; // milliseconds
}

interface AmbientSoundHook {
  isPlaying: boolean;
  volume: number;
  soundType: SoundType;
  toggle: () => void;
  setVolume: (volume: number) => void;
  setSoundType: (type: SoundType) => void;
  play: () => void;
  pause: () => void;
}

export const useAmbientSound = (
  preferences?: UserPreferences,
  options: AmbientSoundOptions = {}
): AmbientSoundHook => {
  const {
    defaultEnabled = false,
    defaultVolume = 0.3,
    defaultType = 'rain',
    autoplay = false,
    fadeInDuration = 1000
  } = options;

  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [soundType, setSoundTypeState] = useState<SoundType>(defaultType);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio based on preferences
  useEffect(() => {
    if (preferences) {
      const preferenceEnabled = preferences.ambientSound ?? defaultEnabled;
      if (preferenceEnabled && autoplay) {
        setIsPlaying(true);
      }
    }
  }, [preferences, defaultEnabled, autoplay]);

  // Audio source management
  const getSoundUrl = useCallback((type: SoundType) => {
    const baseUrl = '/sounds/ambient';
    
    switch (type) {
      case 'rain': return `${baseUrl}/rain.mp3`;
      case 'forest': return `${baseUrl}/forest.mp3`;
      case 'ocean': return `${baseUrl}/ocean.mp3`;
      case 'cafe': return `${baseUrl}/cafe.mp3`;
      case 'night': return `${baseUrl}/night.mp3`;
      case 'city': return `${baseUrl}/city.mp3`;
      case 'fire': return `${baseUrl}/fire.mp3`;
      default: return `${baseUrl}/rain.mp3`;
    }
  }, []);

  // Load and configure audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    
    const audioElement = audioRef.current;
    audioElement.src = getSoundUrl(soundType);
    audioElement.volume = volume;
    
    const handleError = () => {
      toast({
        title: "Erreur audio",
        description: "Impossible de charger le fichier audio",
        variant: "destructive"
      });
      setIsPlaying(false);
    };
    
    audioElement.addEventListener('error', handleError);
    
    return () => {
      audioElement.pause();
      audioElement.removeEventListener('error', handleError);
    };
  }, [soundType, toast, getSoundUrl]);
  
  // Play/Pause control
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    if (isPlaying) {
      // Fade in effect
      let startVolume = 0;
      const targetVolume = volume;
      const fadeSteps = 20;
      const stepDuration = fadeInDuration / fadeSteps;
      const volumeIncrement = targetVolume / fadeSteps;
      
      audioElement.volume = startVolume;
      const playPromise = audioElement.play();
      
      // Handle play promise (required for Chrome)
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Successfully playing
            let step = 0;
            const fadeInterval = setInterval(() => {
              if (step < fadeSteps) {
                startVolume += volumeIncrement;
                audioElement.volume = startVolume;
                step++;
              } else {
                clearInterval(fadeInterval);
              }
            }, stepDuration);
          })
          .catch(error => {
            // Auto-play prevented
            setIsPlaying(false);
            console.log("Auto-play prevented:", error);
          });
      }
    } else {
      audioElement.pause();
    }
  }, [isPlaying, volume, fadeInDuration]);
  
  // Volume control
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);
  
  // Sound type control
  const setSoundType = useCallback((type: SoundType) => {
    setSoundTypeState(type);
    
    // Restart playing if already playing
    if (isPlaying && audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = getSoundUrl(type);
      
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [isPlaying, getSoundUrl]);
  
  // Toggle play/pause
  const toggle = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  // Play control
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  // Pause control
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  return {
    isPlaying,
    volume,
    soundType,
    toggle,
    setVolume,
    setSoundType,
    play,
    pause
  };
};

export default useAmbientSound;
