
// Réexportation des éléments du contexte musical
import { MusicContext, MusicProvider, useMusicContext } from './MusicContext';

// Export the useMusic hook to maintain backwards compatibility
export { MusicContext, MusicProvider };
export const useMusic = useMusicContext;

// Make sure we export the types as well
export type { Track, Playlist } from './types';

