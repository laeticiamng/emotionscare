/**
 * Music Context - Barrel export
 */

import { useContext } from 'react';
import { MusicContext } from './MusicContext';

export { MusicProvider, MusicContext } from './MusicContext';
export type { MusicContextType, MusicTrack, MusicPlaylist, MusicState } from './types';

/**
 * Hook pour utiliser le contexte musique
 */
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
