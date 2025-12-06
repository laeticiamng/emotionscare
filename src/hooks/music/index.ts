// @ts-nocheck
// Centralized Music Hooks - Unified exports
export { default as useMusicRecommendation } from '../useMusicRecommendation';
export { default as useMusicStats } from '../useMusicStats';
export { default as useMusicalCreation } from '../useMusicalCreation';
export { useMusic } from '@/contexts/MusicContext';
export { useMusicControls } from '../useMusicControls';
export { useMusicEmotionIntegration } from '../useMusicEmotionIntegration';

// Re-export for backward compatibility
export type { MusicHookOptions } from '../useMusicRecommendation';