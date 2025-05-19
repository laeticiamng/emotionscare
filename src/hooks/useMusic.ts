
/**
 * 🚩 Hook officiel d'accès au MusicContext.
 * ----------------------------------------
 * À utiliser partout dans l'application pour accéder à la musique/audio.
 * NE PAS créer d'autres hooks de contexte musicaux !
 * Toute nouvelle fonctionnalité doit passer par ce hook unique.
 */

export { useMusic } from './useMusic.tsx';
export default useMusic;
