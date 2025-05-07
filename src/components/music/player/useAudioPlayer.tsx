import { useState, useEffect, useRef } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from '@/hooks/use-toast';

export function useAudioPlayer() {
  const { currentTrack, nextTrack: goToNextTrack, previousTrack: goToPreviousTrack } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioError, setAudioError] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    audio.volume = volume;
    
    // Event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('error', handleError);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('error', handleError);
      
      audio.pause();
      audioRef.current = null;
    };
  }, []);
  
  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setLoadingTrack(true);
      setAudioError(false);
      
      // Reset state
      setCurrentTime(0);
      setDuration(0);
      
      // Get audio URL from track object, accounting for different property names
      // Some track objects use 'url' and others use 'audioUrl'
      const audioUrl = currentTrack.url || '';
      
      if (!audioUrl) {
        console.error('Track is missing url property:', currentTrack);
        setAudioError(true);
        setLoadingTrack(false);
        toast({
          title: "Erreur de lecture",
          description: "Format de piste audio invalide.",
          variant: "destructive"
        });
        return;
      }
      
      // Load and play new track
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setLoadingTrack(false);
            })
            .catch(error => {
              console.error('Playback error:', error);
              setIsPlaying(false);
              setLoadingTrack(false);
            });
        }
      } else {
        setLoadingTrack(false);
      }
    }
  }, [currentTrack]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setLoadingTrack(false);
    }
  };
  
  const handleTrackEnd = () => {
    nextTrack();
  };
  
  const handleError = () => {
    setAudioError(true);
    setLoadingTrack(false);
    toast({
      title: "Erreur de lecture",
      description: "Impossible de lire ce morceau. Veuillez essayer un autre titre.",
      variant: "destructive"
    });
  };
  
  const playTrack = (track: any) => {
    if (!audioRef.current) return;
    
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          startTimeUpdateAnimation();
        })
        .catch(error => {
          console.error('Playback error:', error);
          setIsPlaying(false);
        });
    }
  };
  
  const pauseTrack = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  const startTimeUpdateAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const nextTrack = () => {
    goToNextTrack();
  };
  
  const previousTrack = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If more than 3 seconds into the song, restart it
      audioRef.current.currentTime = 0;
    } else {
      // Otherwise go to previous track
      goToPreviousTrack();
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioError,
    loadingTrack,
    handleProgressClick,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    handleVolumeChange,
    formatTime
  };
}
