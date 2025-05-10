
import { useEffect, useState, useCallback } from 'react';

interface UseSoundOptions {
  volume?: number;
  interrupt?: boolean;
}

const useSound = (
  soundUrl: string, 
  { volume = 0.5, interrupt = true }: UseSoundOptions = {}
) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element but don't load it yet
    const audioElement = new Audio();
    audioElement.volume = volume;
    audioElement.preload = 'none';
    setAudio(audioElement);
    
    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, [soundUrl, volume]);
  
  const play = useCallback(() => {
    if (!audio) return;
    
    // Set the source only when playing to avoid unnecessary network requests
    if (audio.src !== soundUrl) {
      audio.src = soundUrl;
    }
    
    if (interrupt || audio.paused) {
      // Either interrupt current playback or only play if paused
      audio.currentTime = 0;
      audio.play().catch(e => {
        // Handle autoplay restrictions gracefully
        console.log('Audio play prevented:', e);
      });
    }
  }, [audio, soundUrl, interrupt]);
  
  const stop = useCallback(() => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, [audio]);
  
  return { play, stop };
};

export default useSound;
