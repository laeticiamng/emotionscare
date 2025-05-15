
import { useState, useRef, useEffect } from 'react';
import { MusicTrack } from '@/types';

export function useAudioPlayerCore() {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audio.volume = volume;
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('loadstart', () => setLoadingTrack(true));
      audio.addEventListener('durationchange', () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      });
      
      audioRef.current = audio;
    }
    
    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('error', handleError);
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    };
  }, []);
  
  // Handle track change
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audio = audioRef.current;
      
      // Reset state
      setLoadingTrack(true);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      setError(null);
      
      // Load new track
      // Use the appropriate property - prefer audioUrl, but fallback to other properties
      const trackUrl = currentTrack.audioUrl || currentTrack.url || currentTrack.audio_url || '';
      
      if (!trackUrl) {
        setError("This track has no audio URL");
        setLoadingTrack(false);
        return;
      }
      
      audio.src = trackUrl;
      audio.load();
      
      if (isPlaying) {
        audio.play()
          .catch((error) => {
            console.error("Error playing track:", error);
            setError("Could not play this track");
            setIsPlaying(false);
            setLoadingTrack(false);
          });
      }
    }
  }, [currentTrack]);
  
  // Handle play state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
          .catch(() => {
            setIsPlaying(false);
          });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Time update handler
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const currentTime = audio.currentTime;
      const duration = audio.duration || 0;
      const calculatedProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      setCurrentTime(currentTime);
      setProgress(calculatedProgress);
    }
  };
  
  // Track ended handler
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
    
    // If repeat is enabled, restart the track
    if (repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error("Failed to replay track:", error));
    }
  };
  
  // Track loaded handler
  const handleCanPlay = () => {
    setLoadingTrack(false);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.play()
        .catch(error => console.error("Failed to play track after load:", error));
    }
  };
  
  // Error handler
  const handleError = () => {
    setError("Failed to load audio");
    setLoadingTrack(false);
    setIsPlaying(false);
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Seek to specific time
  const seekTo = (timeInSeconds: number) => {
    if (audioRef.current && !isNaN(timeInSeconds)) {
      audioRef.current.currentTime = Math.max(0, Math.min(timeInSeconds, audioRef.current.duration || 0));
    }
  };

  // Calculate progress percentage
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPositionX = e.clientX - rect.left;
      const percentage = clickPositionX / rect.width;
      const newTime = percentage * audioRef.current.duration;
      
      seekTo(newTime);
    }
  };

  // Play a new track or resume the current one
  const playTrack = (track: MusicTrack) => {
    if (currentTrack && track.id === currentTrack.id) {
      // Resume current track
      setIsPlaying(true);
    } else {
      // Play new track
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };
  
  // Pause the current track
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  // Resume the current track
  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };
  
  // Toggle repeat mode
  const toggleRepeat = () => {
    setRepeat(prev => !prev);
  };
  
  // Toggle shuffle mode
  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };
  
  // Update volume
  const handleVolumeChange = (values: number[]) => {
    if (values.length > 0) {
      setVolume(values[0]);
    }
  };
  
  return {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    progress,
    currentTime,
    duration,
    loadingTrack,
    error,
    setCurrentTrack,
    setIsPlaying,
    setVolume,
    setRepeat,
    setShuffle,
    seekTo,
    playTrack,
    pauseTrack,
    resumeTrack,
    formatTime,
    handleProgressClick,
    handleVolumeChange,
    toggleRepeat,
    toggleShuffle
  };
}

export default useAudioPlayerCore;
