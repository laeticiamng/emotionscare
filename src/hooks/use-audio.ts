
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AudioTrack } from '@/types/audio';

interface UseAudioProps {
  toast?: boolean;
}

export const useAudioHandlers = ({ toast = true }: UseAudioProps = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { toast: showToast } = useToast();

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    
    // Set initial volume
    audio.volume = volume;
    
    // Setup event listeners
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      setCurrentTime(0);
      // Additional logic for track ended can be added here
    };
    const onError = (e: ErrorEvent) => {
      setError(new Error("Audio playback error"));
      setIsLoading(false);
      if (toast && showToast) {
        showToast({
          title: "Erreur de lecture audio",
          description: "Impossible de lire ce fichier audio",
          variant: "destructive"
        });
      }
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError as EventListener);
    
    // Cleanup function
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError as EventListener);
      
      // Pause and reset when unmounting
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    };
  }, [volume, toast, showToast]);
  
  const playTrack = (track: AudioTrack) => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    setIsLoading(true);
    setError(null);
    
    // Determine which URL to use
    const audioUrl = track.url || track.audioUrl;
    
    if (!audioUrl) {
      setError(new Error("No audio URL provided"));
      setIsLoading(false);
      if (toast && showToast) {
        showToast({
          title: "Erreur de lecture",
          description: "Aucune URL audio trouvée",
          variant: "destructive"
        });
      }
      return;
    }
    
    // Reset the audio
    audio.pause();
    audio.currentTime = 0;
    
    // Set the new source
    audio.src = audioUrl;
    audio.volume = volume;
    audio.muted = isMuted;
    
    // Play the track
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
          if (toast && showToast) {
            showToast({
              title: "Erreur de lecture",
              description: error.message || "Impossible de lire ce morceau",
              variant: "destructive"
            });
          }
        });
    }
  };
  
  const pauseTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };
  
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    
    if (time >= 0 && time <= audioRef.current.duration) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    if (newVolume < 0 || newVolume > 1) return;
    
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      
      // If changing volume from 0, unmute
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };
  
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };
  
  return {
    audioRef,
    volume,
    isMuted,
    muted: isMuted, // Alias pour compatibilité avec MusicContext
    currentTime,
    duration,
    isLoading,
    error,
    playTrack,
    pauseTrack,
    seekTo,
    setVolume: handleVolumeChange,
    toggleMute,
    formatTime
  };
};

// Alias pour faciliter l'import
export default useAudioHandlers;
