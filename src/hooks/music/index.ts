// Centralized Music Hooks - Unified exports
export { default as useMusicRecommendation } from '../useMusicRecommendation';
export { default as useMusicStats } from '../useMusicStats';
export { useMusicalCreation } from '../useMusicalCreation';
export { useMusic } from '@/contexts/MusicContext';
export { useMusicControls } from '../useMusicControls';
export { useMusicEmotionIntegration } from '../useMusicEmotionIntegration';

// Lyrics & Cache
export { useLyricsGeneration } from './useLyricsGeneration';
export { useSyncedLyrics } from './useSyncedLyrics';
export { useMusicCache } from './useMusicCache';
export { useOfflineMusic } from './useOfflineMusic';

// Re-export for backward compatibility
export type { MusicHookOptions } from '../useMusicRecommendation';