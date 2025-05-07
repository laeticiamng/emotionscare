
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Track } from '@/services/music/types';

export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7); // 0 to 1
  const [audioError, setAudioError] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const { toast } = useToast();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    audio.volume = volume;
    
    // Event listeners
    const handleTimeUpdate = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration);
        setLoadingTrack(false);
      }
    };
    
    const handleTrackEnd = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Call nextTrack to autoplay the next track
      nextTrack();
    };
    
    const handleError = () => {
      setAudioError(true);
      setLoadingTrack(false);
      setIsPlaying(false);
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire ce morceau. Veuillez essayer un autre titre.",
        variant: "destructive"
      });
    };
    
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
  }, [toast, volume]);
  
  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setLoadingTrack(true);
      setAudioError(false);
      
      // Reset state
      setCurrentTime(0);
      setDuration(0);
      
      // Get audio URL from track object
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
              startTimeUpdateAnimation();
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
  }, [currentTrack, isPlaying, toast]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
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
  
  const playTrack = (track: Track) => {
    if (track !== currentTrack) {
      setCurrentTrack(track);
    }
    
    if (audioRef.current) {
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
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };
  
  const nextTrack = () => {
    // This is a placeholder that will be overridden by the parent component
    console.log('Next track requested - will be handled by MusicContext');
  };
  
  const previousTrack = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If more than 3 seconds into the song, restart it
      audioRef.current.currentTime = 0;
    } else {
      // This is a placeholder that will be overridden by the parent component
      console.log('Previous track requested - will be handled by MusicContext');
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
