/**
 * useMusic Hook - Hook avec validation
 * Accès sécurisé au MusicContext
 */

import { useContext } from 'react';
import { MusicContext } from '@/contexts/music/MusicContext';
import type { MusicContextType } from '@/contexts/music/types';

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error(
      'useMusic must be used within a MusicProvider. ' +
      'Make sure your component is wrapped with <MusicProvider>.'
    );
  }
  
  return context;
};

export default useMusic;
