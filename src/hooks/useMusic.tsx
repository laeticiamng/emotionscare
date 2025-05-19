
/**
 * Hook officiel pour accéder au MusicContext
 * -----------------------------------------
 * Utilisez exclusivement ce hook dans tous les composants.
 */

import { useContext } from 'react';
import { MusicContext } from '@/contexts/MusicContext';
import type { MusicContextType } from '@/types/music';

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context as MusicContextType;
};

export default useMusic;
