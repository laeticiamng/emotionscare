
/**
 * 🚩 Hook officiel d'accès au MusicContext.
 * ----------------------------------------
 * À utiliser partout dans l'application pour accéder à la musique/audio.
 * NE PAS créer d'autres hooks de contexte musicaux !
 * Toute nouvelle fonctionnalité doit passer par ce hook unique.
 */
import { useContext } from 'react';
import MusicContext from '@/contexts/MusicContext';

export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export default useMusic;
