
import { useEffect, useState, useCallback } from 'react';

interface UseSoundOptions {
  volume?: number;
  interrupt?: boolean;
  autoPlay?: boolean;
}

const useSound = (
  soundUrl: string, 
  { volume = 0.5, interrupt = true, autoPlay = false }: UseSoundOptions = {}
) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Create audio element
    const audioElement = new Audio(soundUrl);
    audioElement.volume = volume;
    audioElement.preload = 'auto';
    setAudio(audioElement);
    
    if (autoPlay) {
      audioElement.play().catch(e => {
        // Handle autoplay restrictions gracefully
        console.log('Audio autoplay prevented:', e);
      });
    }
    
    audioElement.addEventListener('playing', () => setIsPlaying(true));
    audioElement.addEventListener('pause', () => setIsPlaying(false));
    audioElement.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audioElement.pause();
      audioElement.src = '';
      audioElement.removeEventListener('playing', () => setIsPlaying(true));
      audioElement.removeEventListener('pause', () => setIsPlaying(false));
      audioElement.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [soundUrl, volume, autoPlay]);
  
  const play = useCallback(() => {
    if (!audio) return;
    
    if (interrupt || audio.paused) {
      // Either interrupt current playback or only play if paused
      audio.currentTime = 0;
      audio.play().catch(e => {
        // Handle autoplay restrictions gracefully
        console.log('Audio play prevented:', e);
      });
    }
  }, [audio, interrupt]);
  
  const pause = useCallback(() => {
    if (!audio) return;
    audio.pause();
  }, [audio]);
  
  const stop = useCallback(() => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, [audio]);
  
  const setVolume = useCallback((newVolume: number) => {
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, newVolume));
  }, [audio]);
  
  return { play, pause, stop, setVolume, isPlaying };
};

export default useSound;
