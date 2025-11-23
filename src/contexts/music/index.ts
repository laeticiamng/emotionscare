/**
 * Music Context - Barrel export
 */

import { useContext } from 'react';
import { MusicContext } from './MusicContext';

export { MusicProvider, MusicContext } from './MusicContext';
export type { MusicContextType, MusicTrack, MusicPlaylist, MusicState, MusicAction } from './types';

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

// Export custom music hooks
export { useMusicGeneration } from './useMusicGeneration';
export { useMusicPlayback } from './useMusicPlayback';
export { useMusicPlaylist } from './useMusicPlaylist';
export { useMusicTherapeutic } from './useMusicTherapeutic';

// Export reducer
export { musicReducer } from './reducer';
