
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { Track } from '@/services/music/types';

export function useAudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    volume,
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack, 
    setVolume 
  } = useMusic();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCount = useRef(0);
  const { toast } = useToast();

  // Create and manage audio element
  useEffect(() => {
    // Create audio element if needed
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Add event listeners
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadeddata', setAudioData);
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('error', handleAudioError);
      audioRef.current.addEventListener('loadstart', () => setLoadingTrack(true));
      audioRef.current.addEventListener('canplay', () => {
        setLoadingTrack(false);
        retryCount.current = 0; // Reset retry count on successful load
      });
    }
    
    // Update audio source when track changes
    if (currentTrack) {
      console.log(`Loading track: ${currentTrack.title} - URL: ${currentTrack.url}`);
      setAudioError(null); // Reset previous errors
      setLoadingTrack(true);
      
      try {
        audioRef.current.src = currentTrack.url;
        audioRef.current.volume = volume;
        
        // Add cache-busting query parameter if it's a local URL and we've had issues
        if (retryCount.current > 0 && !currentTrack.url.startsWith('http')) {
          audioRef.current.src = `${currentTrack.url}?cache=${Date.now()}`;
        }
        
        if (isPlaying) {
          playAudio();
        }
      } catch (err) {
        console.error("Error setting audio source:", err);
        setAudioError(`Erreur de chargement: ${err instanceof Error ? err.message : String(err)}`);
        setLoadingTrack(false);
      }
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadeddata', setAudioData);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current.removeEventListener('loadstart', () => setLoadingTrack(true));
        audioRef.current.removeEventListener('canplay', () => setLoadingTrack(false));
        audioRef.current.pause();
      }
    };
  }, [currentTrack]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);
  
  // Start playback
  const playAudio = () => {
    if (!audioRef.current) return;
    
    setLoadingTrack(true);
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setLoadingTrack(false);
        })
        .catch(err => {
          console.error("Audio playback error:", err);
          setAudioError(`Erreur de lecture: ${err.message}`);
          setLoadingTrack(false);
          
          // If auto-play fails, try to recover
          if (err.name === 'NotAllowedError') {
            toast({
              title: "Lecture audio bloquée",
              description: "Votre navigateur a bloqué la lecture automatique. Cliquez sur Play pour continuer.",
              variant: "destructive"
            });
          } else if (retryCount.current < 3) {
            // Retry a few times before giving up
            retryCount.current++;
            
            toast({
              title: "Tentative de récupération",
              description: `Problème de lecture, nouvelle tentative ${retryCount.current}/3...`
            });
            
            setTimeout(() => {
              if (currentTrack) {
                playTrack(currentTrack);
              }
            }, 1000);
          } else {
            // After several retries, move to the next track
            toast({
              title: "Problème de lecture",
              description: "Impossible de lire ce morceau. Passage au morceau suivant...",
              variant: "destructive"
            });
            
            setTimeout(() => {
              nextTrack();
            }, 1500);
          }
        });
    }
  };
  
  // Audio error handler
  const handleAudioError = (e: Event) => {
    const error = (e.target as HTMLAudioElement).error;
    if (error) {
      console.error("Audio error:", error.message, error.code);
      let errorMsg = '';
      
      // More specific error messages based on code
      switch(error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMsg = "La lecture a été interrompue";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMsg = "Problème réseau lors du chargement";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMsg = "Impossible de décoder le fichier audio";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = "Format audio non supporté ou introuvable";
          break;
        default:
          errorMsg = error.message;
      }
      
      setAudioError(`Erreur: ${errorMsg}`);
      setLoadingTrack(false);
      
      if (retryCount.current < 3) {
        retryCount.current++;
        
        toast({
          title: "Erreur audio",
          description: `${errorMsg}. Nouvelle tentative ${retryCount.current}/3...`
        });
        
        // Small delay before retry
        setTimeout(() => {
          if (currentTrack) {
            // Try with a new Audio element
            if (audioRef.current) {
              // Create a new audio element
              const oldAudio = audioRef.current;
              audioRef.current = new Audio();
              audioRef.current.volume = oldAudio.volume;
              
              // Re-add event listeners
              audioRef.current.addEventListener('timeupdate', updateProgress);
              audioRef.current.addEventListener('loadeddata', setAudioData);
              audioRef.current.addEventListener('ended', handleTrackEnd);
              audioRef.current.addEventListener('error', handleAudioError);
              audioRef.current.addEventListener('loadstart', () => setLoadingTrack(true));
              audioRef.current.addEventListener('canplay', () => setLoadingTrack(false));
              
              // Try loading with cache busting
              audioRef.current.src = `${currentTrack.url}?cache=${Date.now()}`;
              playAudio();
            }
          }
        }, 1000);
      } else {
        toast({
          title: "Erreur de lecture",
          description: `${errorMsg}. Passage au morceau suivant...`,
          variant: "destructive"
        });
        
        // Automatically move to next track
        setTimeout(() => {
          nextTrack();
        }, 1500);
      }
    }
  };
  
  // Update progress
  const updateProgress = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Set audio data
  const setAudioData = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    setAudioError(null); // Reset error on successful load
  };
  
  const handleTrackEnd = () => {
    nextTrack();
  };
  
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [currentTrack, duration]);
  
  // Format time display
  const formatTime = useCallback((time: number) => {
    if (!time) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Handle volume change
  const handleVolumeChange = useCallback((values: number[]) => {
    setVolume(values[0]);
  }, [setVolume]);

  return {
    currentTime,
    duration,
    audioError,
    loadingTrack,
    isPlaying,
    volume,
    handleVolumeChange,
    handleProgressClick,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    formatTime
  };
}
