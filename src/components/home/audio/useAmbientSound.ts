
import { useState, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useAmbientSound = () => {
  const { preferences } = useUserPreferences();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Les sons d'ambiance disponibles
  const ambientSounds = {
    nature: '/audio/ambient/nature.mp3',
    rain: '/audio/ambient/rain.mp3',
    forest: '/audio/ambient/forest.mp3',
    ocean: '/audio/ambient/ocean.mp3',
    night: '/audio/ambient/night.mp3',
    cafe: '/audio/ambient/cafe.mp3',
    white_noise: '/audio/ambient/white-noise.mp3'
  };
  
  // Initialisation du son
  useEffect(() => {
    // Création de l'élément audio seulement côté client
    if (typeof window !== 'undefined') {
      const ambientSound = preferences.ambientSound || 'nature';
      const soundUrl = ambientSounds[ambientSound as keyof typeof ambientSounds] || ambientSounds.nature;
      
      const audioElement = new Audio(soundUrl);
      audioElement.loop = true;
      audioElement.volume = 0.3;
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [preferences.ambientSound]);
  
  // Gestion de l'activation/désactivation du son selon les préférences
  useEffect(() => {
    if (!audio) return;
    
    if (preferences.soundEnabled && !isPlaying) {
      audio.play().catch(err => console.error('Error playing ambient sound:', err));
      setIsPlaying(true);
    } else if (!preferences.soundEnabled && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [preferences.soundEnabled, audio, isPlaying]);
  
  // Méthodes pour contrôler le son
  const play = () => {
    if (!audio) return;
    audio.play().catch(err => console.error('Error playing ambient sound:', err));
    setIsPlaying(true);
  };
  
  const pause = () => {
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };
  
  const toggle = () => {
    isPlaying ? pause() : play();
  };
  
  const setVolume = (value: number) => {
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, value));
  };
  
  const changeSound = (soundKey: keyof typeof ambientSounds) => {
    if (!audio) return;
    
    const wasPlaying = !audio.paused;
    audio.pause();
    
    audio.src = ambientSounds[soundKey] || ambientSounds.nature;
    audio.load();
    
    if (wasPlaying) {
      audio.play().catch(err => console.error('Error playing ambient sound:', err));
    }
  };
  
  return {
    isPlaying,
    play,
    pause,
    toggle,
    setVolume,
    changeSound,
    currentSound: preferences.ambientSound || 'nature'
  };
};

export default useAmbientSound;
