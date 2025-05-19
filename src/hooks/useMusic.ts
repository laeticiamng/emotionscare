
import { useContext } from 'react';
import { MusicContext } from '@/contexts/MusicContext';
import { MusicContextType } from '@/types/music';

/**
 * Hook to access the music context throughout the application
 */
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export default useMusic;
