import { useState } from 'react';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const seek = (time: number) => setCurrentTime(time);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    seek,
    setVolume,
    setDuration
  };
};
