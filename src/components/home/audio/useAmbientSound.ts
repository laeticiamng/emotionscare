
import { useState, useEffect, useCallback } from 'react';
import { TIME_OF_DAY, TimeOfDay } from '@/constants/defaults';

interface AmbientSoundOptions {
  autoplay?: boolean;
  volume?: number;
  fadeIn?: boolean;
  defaultMood?: string;
}

export const useAmbientSound = (options: AmbientSoundOptions = {}) => {
  const { 
    autoplay = false, 
    volume: initialVolume = 0.3,
    fadeIn = true,
    defaultMood = 'neutral'
  } = options;
  
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [currentMood, setCurrentMood] = useState(defaultMood);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TIME_OF_DAY.MORNING);
  
  // Get sound URL based on mood and time of day
  const getSoundUrl = useCallback((mood: string, timeOfDay: TimeOfDay): string => {
    // Map moods to sound files
    const soundMap: Record<TimeOfDay, Record<string, string>> = {
      [TIME_OF_DAY.MORNING]: {
        calm: '/audio/morning-calm.mp3',
        joy: '/audio/morning-joy.mp3',
        neutral: '/audio/morning-neutral.mp3',
        sadness: '/audio/morning-calm.mp3', // Fallback to calm for negative emotions
        default: '/audio/morning-neutral.mp3'
      },
      [TIME_OF_DAY.AFTERNOON]: {
        calm: '/audio/afternoon-calm.mp3',
        joy: '/audio/afternoon-joy.mp3',
        neutral: '/audio/afternoon-neutral.mp3',
        sadness: '/audio/afternoon-calm.mp3',
        default: '/audio/afternoon-neutral.mp3'
      },
      [TIME_OF_DAY.EVENING]: {
        calm: '/audio/evening-calm.mp3',
        joy: '/audio/evening-joy.mp3',
        neutral: '/audio/evening-neutral.mp3',
        sadness: '/audio/evening-calm.mp3',
        default: '/audio/evening-neutral.mp3'
      },
      [TIME_OF_DAY.NIGHT]: {
        calm: '/audio/night-calm.mp3',
        joy: '/audio/night-joy.mp3',
        neutral: '/audio/night-calm.mp3',
        sadness: '/audio/night-calm.mp3',
        default: '/audio/night-calm.mp3'
      }
    };
    
    // Default to morning sounds if the time of day isn't recognized
    const defaultSounds = {
      default: '/audio/neutral-ambient.mp3'
    };
    
    // Get sounds for the current time of day
    const timeSounds = soundMap[timeOfDay] || defaultSounds;
    
    // Get the specific sound for the mood, or fallback to default
    return timeSounds[mood] || timeSounds.default || defaultSounds.default;
  }, []);
  
  // Determine time of day
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) setTimeOfDay(TIME_OF_DAY.MORNING);
    else if (hour >= 12 && hour < 18) setTimeOfDay(TIME_OF_DAY.AFTERNOON);
    else if (hour >= 18 && hour < 22) setTimeOfDay(TIME_OF_DAY.EVENING);
    else setTimeOfDay(TIME_OF_DAY.NIGHT);
  }, []);
  
  // Initialize audio
  useEffect(() => {
    // Create audio element
    const audioElement = new Audio();
    audioElement.loop = true;
    audioElement.volume = fadeIn ? 0 : volume;
    
    // Set source based on mood and time
    const soundUrl = getSoundUrl(currentMood, timeOfDay);
    audioElement.src = soundUrl;
    
    // Load audio
    audioElement.load();
    
    // Set audio element
    setAudio(audioElement);
    
    // Autoplay if enabled
    if (autoplay) {
      audioElement.play()
        .then(() => {
          setIsPlaying(true);
          
          // Fade in if enabled
          if (fadeIn) {
            let vol = 0;
            const interval = setInterval(() => {
              if (vol < volume) {
                vol += 0.05;
                audioElement.volume = vol > volume ? volume : vol;
              } else {
                clearInterval(interval);
              }
            }, 200);
          }
        })
        .catch(error => {
          console.error('Error autoplaying ambient sound:', error);
        });
    }
    
    // Clean up
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [timeOfDay, getSoundUrl, currentMood, autoplay, fadeIn, volume]);
  
  // Change volume
  useEffect(() => {
    if (audio && isPlaying) {
      audio.volume = volume;
    }
  }, [audio, volume, isPlaying]);
  
  // Play audio
  const play = useCallback(() => {
    if (audio) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing ambient sound:', error);
        });
    }
  }, [audio]);
  
  // Pause audio
  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);
  
  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);
  
  // Change volume
  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);
  
  // Change sound based on mood
  const changeSoundByMood = useCallback((mood: string) => {
    setCurrentMood(mood);
    
    if (audio) {
      const soundUrl = getSoundUrl(mood, timeOfDay);
      
      // Only change source if it's different
      if (audio.src !== soundUrl) {
        // Remember if it was playing
        const wasPlaying = !audio.paused;
        
        // Change source
        audio.src = soundUrl;
        audio.load();
        
        // Resume playback if it was playing
        if (wasPlaying) {
          audio.play()
            .catch(error => {
              console.error('Error playing ambient sound after mood change:', error);
            });
        }
      }
    }
  }, [audio, getSoundUrl, timeOfDay]);
  
  return {
    isPlaying,
    volume,
    currentMood,
    play,
    pause,
    toggle,
    changeVolume,
    changeSoundByMood
  };
};
