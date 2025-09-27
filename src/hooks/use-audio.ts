
import { useState, useRef, useEffect } from 'react';

interface AudioState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
}

const useAudio = (src?: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    isMuted: false,
    isLoading: false
  });

  useEffect(() => {
    if (src) {
      audioRef.current = new Audio(src);
      const audio = audioRef.current;

      const setAudioData = () => {
        setState(prev => ({
          ...prev,
          duration: audio.duration || 0,
          isLoading: false
        }));
      };

      const setAudioTime = () => {
        setState(prev => ({
          ...prev,
          currentTime: audio.currentTime
        }));
      };

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, [src]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    }
  };

  return {
    ...state,
    play,
    pause,
    setVolume
  };
};

export default useAudio;
