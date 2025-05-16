
import { useState, useEffect, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';

export function useMusicPlayer() {
  const music = useMusic();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize when first used
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  
  if (!isInitialized) {
    return {
      ...music,
      isInitialized,
      error: null
    };
  }
  
  return {
    ...music,
    isInitialized,
    error: null
  };
}

export default useMusicPlayer;
