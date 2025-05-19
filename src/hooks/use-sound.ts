
import { useRef, useState, useEffect } from 'react';

interface UseSoundOptions {
  src: string;
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
  soundEnabled?: boolean;
}

export default function useSound(options: UseSoundOptions) {
  const { src, volume = 1, loop = false, autoPlay = false, soundEnabled = true } = options;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Initialize audio on mount
  useEffect(() => {
    // Only create audio element if we're in a browser environment
    if (typeof window !== 'undefined') {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.loop = loop;
      
      // Get sound preference from localStorage
      const savedSoundPreference = localStorage.getItem('soundEnabled');
      const effectiveSoundEnabled = savedSoundPreference !== null 
        ? savedSoundPreference === 'true'
        : soundEnabled;
      
      audio.muted = !effectiveSoundEnabled;
      setIsMuted(!effectiveSoundEnabled);
      
      // Set up event listeners
      audio.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
        setDuration(audio.duration);
        if (autoPlay) {
          audio.play().catch(() => {
            // Auto-play was prevented, do nothing
            // Most browsers block auto-play unless there was user interaction
          });
        }
      });
      
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.addEventListener('ended', () => !loop && setIsPlaying(false));
      
      audioRef.current = audio;
      
      return () => {
        // Clean up
        audio.pause();
        audio.src = '';
        audio.remove();
        audioRef.current = null;
      };
    }
  }, [src, volume, loop, autoPlay, soundEnabled]);
  
  // Function to play the sound
  const play = () => {
    if (audioRef.current && isLoaded) {
      // Reset to start if it was already played
      if (!isPlaying) {
        audioRef.current.currentTime = 0;
      }
      
      audioRef.current.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };
  
  // Function to pause the sound
  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };
  
  // Function to stop the sound
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  // Function to toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
      localStorage.setItem('soundEnabled', String(!newMuteState));
    }
  };
  
  // Function to set volume
  const setVolumeLevel = (newVolume: number) => {
    if (audioRef.current && newVolume >= 0 && newVolume <= 1) {
      audioRef.current.volume = newVolume;
    }
  };

  return {
    play,
    pause,
    stop,
    isPlaying,
    isLoaded,
    isMuted,
    toggleMute,
    duration,
    currentTime,
    setVolume: setVolumeLevel,
    audio: audioRef.current
  };
}
