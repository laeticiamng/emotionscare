
import { useState } from 'react';

export const useMusicControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const seek = (time: number) => setCurrentTime(time);
  const toggleMute = () => setIsMuted(!isMuted);

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
    toggleMute,
    setCurrentTime,
    setDuration
  };
};
