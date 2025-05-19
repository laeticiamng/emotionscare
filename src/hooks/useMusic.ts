
import { useContext } from 'react';
import { MusicContext } from '@/contexts/MusicContext';

/**
 * Hook for accessing the music context
 */
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default useMusic;
