
import { useState, useRef, useEffect, useCallback } from 'react';
import { MusicTrack } from '@/types/music';

interface AudioHandlersProps {
  toast?: any;
}

export const useAudioHandlers = ({ toast }: AudioHandlersProps = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio.currentTime && audio.duration) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [volume]);

  const loadTrack = useCallback((track: MusicTrack) => {
    try {
      if (audioRef.current) {
        const audio = audioRef.current;
        
        // Determine which URL to use based on what's available
        const audioSource = track.audioUrl || track.url || '';
        
        audio.src = audioSource;
        audio.load();
        setCurrentTrack(track);
      }
    } catch (err) {
      console.error("Error loading track:", err);
    }
  }, []);

  const playTrack = useCallback((track: MusicTrack) => {
    loadTrack(track);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Error playing track:", err);
          if (toast) {
            toast({
              title: "Erreur",
              description: "Impossible de jouer le morceau",
              variant: "destructive"
            });
          }
        });
    }
  }, [loadTrack, toast]);

  const pauseTrack = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolumeState(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  return {
    audioRef,
    isPlaying,
    currentTrack,
    volume,
    isMuted,
    currentTime,
    duration,
    playTrack,
    pauseTrack,
    seekTo,
    setVolume,
    toggleMute
  };
};
