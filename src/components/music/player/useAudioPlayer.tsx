
import { useState, useEffect, useRef } from 'react';
import { Track } from '@/services/music/types';
import { MusicTrack } from '@/types/music';

/**
 * Hook to manage audio playback functionality
 */
export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7); // 0 to 1
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  const animationRef = useRef<number>();

  // Handle time update
  const updateTime = () => {
    if (audio) {
      setCurrentTime(audio.currentTime);
      animationRef.current = requestAnimationFrame(updateTime);
    }
  };

  // Handle audio playback
  useEffect(() => {
    if (!audio) return;

    // Set volume
    audio.volume = volume;

    // Set up audio event listeners
    const handleEnded = () => {
      // When track ends, we'll let the parent component handle what happens next
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Error playing audio on repeat:', error);
        });
      } else {
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoadingTrack(false);
      setAudioError(false);
    };

    const handleError = () => {
      setAudioError(true);
      setLoadingTrack(false);
      setIsPlaying(false);
      console.error('Audio error occurred');
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audio, volume, repeat]);

  // Update audio source when current track changes
  useEffect(() => {
    if (!audio || !currentTrack) return;

    // Utiliser la propriété url, qui est désormais obligatoire pour tous les types de pistes
    const audioUrl = currentTrack.url;
    
    if (audioUrl) {
      setLoadingTrack(true);
      audio.src = audioUrl;
      
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          setAudioError(true);
        });
      }
    }
  }, [audio, currentTrack, isPlaying]);

  // Toggle play/pause when isPlaying changes
  useEffect(() => {
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
      animationRef.current = requestAnimationFrame(updateTime);
    } else {
      audio.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [audio, isPlaying]);

  const playTrack = (track: Track | MusicTrack) => {
    // S'assurer que la track a une propriété url valide
    if (!track.url && 'audioUrl' in track && track.audioUrl) {
      (track as MusicTrack).url = track.audioUrl;
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const nextTrack = () => {
    // This will be implemented in the MusicContext
    console.log('Next track requested from useAudioPlayer');
  };

  const previousTrack = () => {
    // This will be implemented in the MusicContext
    console.log('Previous track requested from useAudioPlayer');
  };

  const toggleRepeat = () => {
    setRepeat(prev => !prev);
  };

  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio || !duration) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / container.offsetWidth;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    if (audio) {
      audio.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    currentTime,
    duration,
    loadingTrack,
    audioError,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    setCurrentTrack,
    handleProgressClick,
    handleVolumeChange,
    formatTime
  };
}
