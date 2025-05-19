
/**
 * 🎵 Music Context
 * ------------------------------------
 * This file serves as the central export point for all music context functionality.
 * Import from this file instead of directly referencing the implementation.
 */

// Export everything from the MusicContext implementation but not using star export
export { 
  MusicContext, 
  MusicProvider
} from '@/contexts/MusicContext';

// Export the types
export type { 
  MusicContextType,
  MusicTrack,
  MusicPlaylist
} from '@/types/music';

// Export the default context explicitly rather than using star export
import MusicContextDefault from '@/contexts/MusicContext';
export { MusicContextDefault as default };
