
/**
 * 🚩 Hook officiel d'accès au MusicContext.
 * ----------------------------------------
 * À utiliser partout dans l'application pour accéder à la musique/audio.
 * NE PAS créer d'autres hooks de contexte musicaux !
 * Toute nouvelle fonctionnalité doit passer par ce hook unique.
 */

import { useContext } from 'react';
import { MusicContext } from '@/contexts/MusicContext';
import type { MusicContextType } from '@/types/music';

// Export the hook directly
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  // Cast to ensure type consistency across the app
  return context as MusicContextType;
};

export default useMusic;
