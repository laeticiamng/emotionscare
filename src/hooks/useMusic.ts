
/**
 * 🚩 Hook officiel d'accès au MusicContext.
 * ----------------------------------------
 * À utiliser partout dans l'application pour accéder à la musique/audio.
 * NE PAS créer d'autres hooks de contexte musicaux !
 * Toute nouvelle fonctionnalité doit passer par ce hook unique.
 */

import { MusicContextType } from '@/types/music';
import { useMusic as useMusicHook } from './useMusic.tsx';

export const useMusic = useMusicHook;
export default useMusic;
