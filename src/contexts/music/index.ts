// Export unifié du contexte musique
import { useMusic as useMusicHook, MusicProvider, MusicContext } from '../MusicContext';

// Réexport avec noms cohérents
export const useMusic = useMusicHook;
export { MusicProvider, MusicContext };

// Export par défaut
export default useMusicHook;