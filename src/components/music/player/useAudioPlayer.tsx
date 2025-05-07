
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
      
      // Add stalled and waiting event handlers
      audioRef.current.addEventListener('stalled', () => {
        console.log("Audio playback stalled");
        setLoadingTrack(true);
      });
      
      audioRef.current.addEventListener('waiting', () => {
        console.log("Audio playback waiting for data");
        setLoadingTrack(true);
      });
      
      audioRef.current.addEventListener('playing', () => {
        console.log("Audio playback started");
        setLoadingTrack(false);
        setAudioError(null);
      });
    }
    
    // Update audio source when track changes
    if (currentTrack) {
      console.log(`Loading track: ${currentTrack.title} - URL: ${currentTrack.url}`);
      setAudioError(null); // Reset previous errors
      setLoadingTrack(true);
      
      try {
        // Force cache busting for all tracks to avoid stale data
        const cacheBuster = `?cache=${Date.now()}`;
        const trackUrl = currentTrack.url.includes('?') 
          ? `${currentTrack.url}&_=${Date.now()}` 
          : `${currentTrack.url}${cacheBuster}`;
        
        audioRef.current.src = trackUrl;
        audioRef.current.volume = volume;
        audioRef.current.crossOrigin = "anonymous"; // Enable CORS for external audio resources
        
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
        audioRef.current.removeEventListener('stalled', () => setLoadingTrack(true));
        audioRef.current.removeEventListener('waiting', () => setLoadingTrack(true));
        audioRef.current.removeEventListener('playing', () => setLoadingTrack(false));
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
  
  // Start playback with better error handling
  const playAudio = () => {
    if (!audioRef.current) return;
    
    setLoadingTrack(true);
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setLoadingTrack(false);
          console.log("Playback started successfully");
        })
        .catch(err => {
          console.error("Audio playback error:", err);
          
          // Specific error handling based on error type
          if (err.name === 'NotAllowedError') {
            setAudioError("La lecture automatique n'est pas autorisée par votre navigateur");
            toast({
              title: "Lecture audio bloquée",
              description: "Votre navigateur a bloqué la lecture automatique. Cliquez sur Play pour continuer.",
              variant: "destructive"
            });
          } 
          else if (err.name === 'NotSupportedError') {
            setAudioError("Format audio non supporté");
          }
          else if (err.name === 'AbortError') {
            setAudioError("Lecture interrompue");
          }
          else {
            setAudioError(`Erreur de lecture: ${err.message}`);
          }
          
          setLoadingTrack(false);
          
          // Auto-retry logic
          if (retryCount.current < 3) {
            retryCount.current++;
            
            toast({
              title: "Tentative de récupération",
              description: `Problème de lecture, nouvelle tentative ${retryCount.current}/3...`
            });
            
            setTimeout(() => {
              if (currentTrack) {
                console.log(`Retry attempt ${retryCount.current} for track: ${currentTrack.title}`);
                
                // Try with a different Audio instance for better recovery
                if (audioRef.current) {
                  // Try alternate audio source format if available
                  playTrack(currentTrack);
                }
              }
            }, 1500);
          } else {
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
  
  // Audio error handler with improved diagnostics
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
          errorMsg = "Format audio non supporté ou URL incorrecte";
          break;
        default:
          errorMsg = error.message || "Erreur inconnue";
      }
      
      // Log additional information for debugging
      console.log(`Audio error details: Code ${error.code}, Audio src: ${audioRef.current?.src}`);
      
      setAudioError(`Erreur: ${errorMsg}`);
      setLoadingTrack(false);
      
      if (retryCount.current < 3) {
        retryCount.current++;
        
        toast({
          title: "Erreur audio",
          description: `${errorMsg}. Nouvelle tentative ${retryCount.current}/3...`,
          variant: "default" // Changed from "warning" to "default" since "warning" isn't a valid variant
        });
        
        // Small delay before retry
        setTimeout(() => {
          if (currentTrack) {
            // Try with an alternative approach based on error type
            if (error.code === MediaError.MEDIA_ERR_NETWORK) {
              // For network errors, try with a different URL format or fallback
              console.log("Network error, trying alternative approach");
              
              // Check if we can use a different audio source format
              if (currentTrack.url.endsWith('.mp3')) {
                // Try with .ogg version if available, or just retry with cache busting
                const alternateUrl = currentTrack.url.replace('.mp3', '.ogg');
                const trackWithAlternateUrl = {
                  ...currentTrack,
                  url: alternateUrl
                };
                playTrack(trackWithAlternateUrl);
              } else {
                // Just retry with cache busting
                const refreshedTrack = {
                  ...currentTrack,
                  url: `${currentTrack.url}${currentTrack.url.includes('?') ? '&' : '?'}_=${Date.now()}`
                };
                playTrack(refreshedTrack);
              }
            } else {
              // For other errors, create a new audio element and try again
              if (audioRef.current) {
                const oldAudio = audioRef.current;
                
                // Clean up old reference
                oldAudio.removeEventListener('timeupdate', updateProgress);
                oldAudio.removeEventListener('loadeddata', setAudioData);
                oldAudio.removeEventListener('ended', handleTrackEnd);
                oldAudio.removeEventListener('error', handleAudioError);
                
                // Create new audio element
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
