
import { useState, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';

export function useMusicPlayer() {
  const music = useMusic();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize on first render
  useEffect(() => {
    if (music.isInitialized) {
      setIsInitialized(true);
    }
  }, [music.isInitialized]);
  
  return {
    ...music,
    isInitialized,
  };
}

export default useMusicPlayer;
