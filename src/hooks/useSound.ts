// @ts-nocheck
import { useCallback } from 'react';
import { logger } from '@/lib/logger';

type SoundType = 'success' | 'error' | 'notification' | 'hover' | 'tap' | 'complete';

// Map of sound types to their files
const soundMap: Record<SoundType, string> = {
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  notification: '/sounds/notification.mp3',
  hover: '/sounds/hover.mp3',
  tap: '/sounds/click.mp3',
  complete: '/sounds/complete.mp3'
};

// For sound fallbacks, we'll use existing sounds in the project
const soundFallbacks: Record<SoundType, string> = {
  success: '/sounds/welcome.mp3',
  error: '/sounds/click.mp3',
  notification: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  tap: '/sounds/click.mp3',
  complete: '/sounds/welcome.mp3'
};

interface UseSound {
  playSound: (type: SoundType) => void;
  stopSound: (type: SoundType) => void;
}

export default function useSound(): UseSound {
  const playSound = useCallback((type: SoundType) => {
    try {
      // Try to play the requested sound
      const audio = new Audio(soundMap[type]);
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch(() => {
        // If the requested sound fails, try the fallback
        const fallbackAudio = new Audio(soundFallbacks[type]);
        fallbackAudio.volume = 0.3;
        fallbackAudio.play().catch(() => {
          logger.warn('Could not play sound', { type }, 'UI');
        });
      });
    } catch (error) {
      logger.warn('Error playing sound', error as Error, 'UI');
    }
  }, []);

  const stopSound = useCallback((type: SoundType) => {
    // This would require keeping references to active Audio objects
    // For simplicity, we're just implementing the interface
    logger.debug('Stop sound', { type }, 'UI');
  }, []);

  return { playSound, stopSound };
}
