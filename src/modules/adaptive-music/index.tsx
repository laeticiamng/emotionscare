/**
 * Module Adaptive Music - Point d'entrée
 */
import { lazyDefault } from '@/lib/lazyDefault';

// Page principale
export { default } from './AdaptiveMusicPage';
export { default as AdaptiveMusicPage } from './AdaptiveMusicPage';

export const LazyAdaptiveMusicPage = lazyDefault(
  () => import('./AdaptiveMusicPage'),
  'AdaptiveMusicPage'
);

// Types
export * from './types';

// Service
export { AdaptiveMusicService } from './adaptiveMusicService';

// Hooks
export { useAdaptiveMusic } from './useAdaptiveMusic';
