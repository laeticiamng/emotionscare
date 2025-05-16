
import { useState, useEffect, useRef, useCallback } from 'react';
import { MusicTrack } from '@/types/music';

interface UseAudioHandlersProps {
  toast: any; // Using any here to avoid importing the full toast type
}

export function useAudioHandlers({ toast }: UseAudioHandlersProps) {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.7); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [volume]);
  
  // Update time as track plays
  const updateTime = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);
  
  // Setup audio event listeners
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Set up event listeners
    audio.ontimeupdate = updateTime;
    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };
    
    return () => {
      // Clean up event listeners
      audio.ontimeupdate = null;
      audio.onloadedmetadata = null;
    };
  }, [updateTime]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Play a specific track
  const playTrack = useCallback((track: MusicTrack) => {
    if (audioRef.current) {
      audioRef.current.src = track.url || track.audioUrl || '';
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentTrack(track);
      }).catch(err => {
        console.error('Error playing track:', err);
        toast({
          title: 'Erreur de lecture',
          description: "Impossible de lire cette piste. Veuillez réessayer.",
          variant: 'destructive'
        });
      });
    }
  }, [toast]);
  
  // Pause current track
  const pauseTrack = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);
  
  // Seek to a specific position
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
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
    toggleMute,
    setCurrentTrack
  };
}
