
import { useState, useEffect, useRef, useCallback } from 'react';
import { MusicTrack } from '@/types/music';

interface UseAudioHandlersOptions {
  toast: any;
}

export const useAudioHandlers = ({ toast }: UseAudioHandlersOptions) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Set volume
    audio.volume = volume;
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [volume]);
  
  // Play track function
  const playTrack = useCallback((track: MusicTrack) => {
    if (audioRef.current) {
      // Reset state
      setCurrentTime(0);
      
      // Update current track
      setCurrentTrack(track);
      
      // Set audio source - handle different property names
      const source = track.audioUrl || track.url;
      audioRef.current.src = source;
      
      // Play audio
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Error playing track:", error);
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire ce morceau. Veuillez réessayer.",
            variant: "destructive"
          });
        });
    }
  }, [toast]);
  
  // Pause track function
  const pauseTrack = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);
  
  // Toggle mute function
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
    }
  }, [isMuted]);
  
  // Seek function
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
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
