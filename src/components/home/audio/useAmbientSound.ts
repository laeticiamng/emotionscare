
import { useEffect, useState, useRef, useCallback } from 'react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

export const useAmbientSound = (defaultMood: string = 'calm') => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentMood, setCurrentMood] = useState<string>(defaultMood);
  const { preferences } = useUserPreferences();

  const toggle = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const changeMood = useCallback((mood: string) => {
    setCurrentMood(mood);
  }, []);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    // Get sound URL based on mood
    const getAudioSource = (mood: string) => {
      const moodMap: Record<string, string> = {
        calm: '/audio/calm-ambient.mp3',
        focus: '/audio/focus-ambient.mp3',
        relax: '/audio/relax-ambient.mp3',
        energize: '/audio/energize-ambient.mp3',
      };
      return moodMap[mood.toLowerCase()] || moodMap.calm;
    };

    // Update audio source when mood changes
    const audioSource = getAudioSource(currentMood);
    audioRef.current.src = audioSource;
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Check if ambient sound should be enabled based on user preferences
    const ambientSoundEnabled = typeof preferences.ambientSound === 'boolean' 
      ? preferences.ambientSound 
      : true;

    // Play or pause based on state and preferences
    if (isPlaying && ambientSoundEnabled) {
      audioRef.current.play().catch(err => console.error('Error playing audio:', err));
    } else {
      audioRef.current.pause();
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [isPlaying, currentMood, volume, preferences]);

  return {
    isPlaying,
    volume,
    currentMood,
    toggle,
    updateVolume,
    changeMood,
  };
};
