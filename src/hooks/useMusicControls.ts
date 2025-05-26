
import { useState, useCallback } from 'react';

export const useMusicControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const play = useCallback(() => {
    setIsPlaying(true);
    console.log('Music: Playing');
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    console.log('Music: Paused');
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    console.log('Music: Toggle play/pause');
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
    console.log('Music: Seek to', time);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    console.log('Music: Toggle mute');
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute
  };
};
