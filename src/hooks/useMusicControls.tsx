import { useCallback, useState, ChangeEvent } from 'react';
import { useMusicCompat } from '@/hooks/useMusicCompat';
import { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

export const useMusicControls = () => {
  const music = useMusicCompat();
  const { currentTrack, isPlaying, volume } = music.state;
  const { play, pause, next, previous, setVolume } = music;

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
    play(track);
  }, [play]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      play(currentTrack);
    }
  }, [isPlaying, currentTrack, pause, play]);

  // Handle seeking
  const handleSeek = useCallback((time: number) => {
    // Implementation depends on your audio implementation
    logger.debug('Seeking to', { time }, 'MUSIC');
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
    nextTrack: next,
    previousTrack: previous
  };
};

export default useMusicControls;
