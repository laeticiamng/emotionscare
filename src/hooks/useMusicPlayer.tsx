
/**
 * useMusicPlayer.tsx
 * ⚠️ DEPRECATED: This is an alias for useMusic for backwards compatibility.
 * Please use useMusic directly from '@/hooks/useMusic' instead.
 */

import { useEffect, useState } from 'react';
import { useMusic } from '@/hooks/useMusic';

export interface MusicPlayerOptions {
  autoPlay?: boolean;
  initialVolume?: number;
  enableLogs?: boolean;
}

export function useMusicPlayer(options?: MusicPlayerOptions) {
  const music = useMusic();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize with options
  useEffect(() => {
    if (music.isInitialized) {
      setIsInitialized(true);
      
      // Set initial volume if provided
      if (options?.initialVolume !== undefined) {
        music.setVolume(options.initialVolume);
      }
      
      // Enable debug logs
      if (options?.enableLogs) {
        console.log('[MusicPlayer] Initialized');
      }
    }
  }, [music.isInitialized, options]);
  
  // Return the music context with our enhanced state
  return {
    ...music,
    isInitialized,
  };
}

export default useMusicPlayer;
