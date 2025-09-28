
/**
 * This is a simple wrapper around the use-sound package
 * We're using a custom implementation to avoid adding extra dependencies
 */

import { useRef, useEffect } from 'react';

type PlayFunction = () => void;

interface SoundOptions {
  volume?: number;
  soundEnabled?: boolean;
  loop?: boolean;
}

export default function useSound(
  url: string,
  { volume = 1, soundEnabled = true, loop = false }: SoundOptions = {}
): [PlayFunction] {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
    }

    // Update audio properties
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url, volume, loop]);

  // Play function
  const play: PlayFunction = () => {
    if (audioRef.current && soundEnabled) {
      // Reset the audio to the beginning if it's already playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        // Ignore autoplay errors - common in browsers requiring user interaction
        console.debug('Audio playback error (likely autoplay restriction):', e);
      });
    }
  };

  return [play];
}
