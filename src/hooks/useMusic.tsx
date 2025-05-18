
import { useContext } from 'react';
import MusicContext from '@/contexts/MusicContext';

/**
 * Hook officiel pour accéder au MusicContext
 * -----------------------------------------
 * Utilisez exclusivement ce hook dans tous les composants.
 */

export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export default useMusic;
