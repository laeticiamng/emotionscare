
import { useState, useEffect, useCallback } from 'react';
import { TIME_OF_DAY } from '@/constants/defaults';

interface AmbientSoundOptions {
  autoplay?: boolean;
  volume?: number;
  loop?: boolean;
  fadeIn?: boolean;
  fadeOutOnUnmount?: boolean;
}

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return TIME_OF_DAY.MORNING;
  if (hour >= 12 && hour < 18) return TIME_OF_DAY.AFTERNOON;
  if (hour >= 18 && hour < 22) return TIME_OF_DAY.EVENING;
  return TIME_OF_DAY.NIGHT;
};

// These would typically come from your API
const getMoodByTimeOfDay = (timeOfDay: string): string => {
  switch(timeOfDay) {
    case TIME_OF_DAY.MORNING: return 'calm';
    case TIME_OF_DAY.AFTERNOON: return 'focus';
    case TIME_OF_DAY.EVENING: return 'relaxed';
    case TIME_OF_DAY.NIGHT: return 'sleep';
    default: return 'calm';
  }
};

const DEFAULT_SOUNDS = {
  morning: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6435fe5.mp3',  
  afternoon: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8a439581b.mp3',
  evening: 'https://cdn.pixabay.com/audio/2021/08/09/audio_88447803bd.mp3',
  night: 'https://cdn.pixabay.com/audio/2022/03/31/audio_18318e369a.mp3',
};

export function useAmbientSound(options: AmbientSoundOptions = {}) {
  const {
    autoplay = false,
    volume: initialVolume = 0.3,
    loop = true,
    fadeIn = true,
    fadeOutOnUnmount = true
  } = options;
  
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [sound, setSound] = useState<string>('');
  const [mood, setMood] = useState('');
  
  // Initialize audio
  useEffect(() => {
    const timeOfDay = getTimeOfDay();
    setTimeOfDay(timeOfDay);
    const mood = getMoodByTimeOfDay(timeOfDay);
    setMood(mood);
    
    // In a real implementation, you would call your Music Generator API here
    // For now, use a preset based on time of day
    const soundUrl = DEFAULT_SOUNDS[timeOfDay as keyof typeof DEFAULT_SOUNDS];
    setSound(soundUrl);
    
    const audioElement = new Audio(soundUrl);
    audioElement.loop = loop;
    audioElement.volume = 0; // Start silent for fade-in
    setAudio(audioElement);
    
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [loop]);
  
  // Fade in effect
  useEffect(() => {
    if (audio && fadeIn && isPlaying) {
      let currentVolume = 0;
      const fadeInterval = setInterval(() => {
        currentVolume = Math.min(currentVolume + 0.05, volume);
        if (audio) audio.volume = currentVolume;
        
        if (currentVolume >= volume) {
          clearInterval(fadeInterval);
        }
      }, 100);
      
      return () => clearInterval(fadeInterval);
    }
  }, [audio, fadeIn, isPlaying, volume]);
  
  // Autoplay effect
  useEffect(() => {
    if (audio && autoplay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Autoplay failed:', error);
            // Most browsers require user interaction before audio can play
            setIsPlaying(false);
          });
      }
    }
  }, [audio, autoplay]);
  
  // Handle fade out on unmount
  useEffect(() => {
    return () => {
      if (audio && fadeOutOnUnmount && isPlaying) {
        const originalVolume = audio.volume;
        let currentVolume = originalVolume;
        
        const fadeOutInterval = setInterval(() => {
          currentVolume = Math.max(currentVolume - 0.05, 0);
          audio.volume = currentVolume;
          
          if (currentVolume <= 0) {
            clearInterval(fadeOutInterval);
            audio.pause();
          }
        }, 50);
        
        // Clear interval after 1 second as a safety measure
        setTimeout(() => clearInterval(fadeOutInterval), 1000);
      }
    };
  }, [audio, fadeOutOnUnmount, isPlaying]);
  
  const play = useCallback(() => {
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Play failed:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [audio]);
  
  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);
  
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);
  
  const adjustVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audio) {
      audio.volume = clampedVolume;
    }
  }, [audio]);
  
  const changeSoundByMood = useCallback((newMood: string) => {
    setMood(newMood);
    // In a real implementation, you would call your Music Generator API here
    // For demo purposes, we're using fixed sounds
    pause();
    // This would be replaced with a call to your music API
  }, [pause]);
  
  return {
    isPlaying,
    play,
    pause,
    toggle,
    volume,
    adjustVolume,
    timeOfDay,
    mood,
    changeSoundByMood,
    sound
  };
}
