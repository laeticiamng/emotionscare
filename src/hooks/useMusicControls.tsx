
import { useCallback, useState, ChangeEvent } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack } from '@/types/music';

export const useMusicControls = () => {
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

  // Format time in mm:ss
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  }, []);

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle track selection
  const handleTrackSelect = useCallback((track: MusicTrack) => {
    playTrack(track);
  }, [playTrack]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  }, [isPlaying, currentTrack, pauseTrack, playTrack]);

  // Handle seeking
  const handleSeek = useCallback((time: number) => {
    // Implementation depends on your audio implementation
    console.log('Seeking to:', time);
    setCurrentTime(time);
  }, []);

  // Handle audio time update
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  // Handle audio duration loaded
  const handleDurationLoaded = useCallback((newDuration: number) => {
    setDuration(newDuration);
  }, []);

  // Handle volume change
  // Modified to handle both direct number values and input change events
  const handleVolumeChange = useCallback((valueOrEvent: number | ChangeEvent<HTMLInputElement>) => {
    if (typeof valueOrEvent === 'number') {
      // Direct number value
      setVolume(valueOrEvent);
    } else {
      // Event from an input element
      const value = parseFloat(valueOrEvent.target.value);
      if (!isNaN(value)) {
        setVolume(value / 100); // Assuming input range is 0-100
      }
    }
  }, [setVolume]);

  return {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    progressPercent,
    formatTime,
    handleTrackSelect,
    togglePlayPause,
    handleSeek,
    handleTimeUpdate,
    handleDurationLoaded,
    handleVolumeChange,
    nextTrack,
    previousTrack
  };
};

export default useMusicControls;
