import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './FlashGlowUltraPage';
export { default as FlashGlowUltraPage } from './FlashGlowUltraPage';

export const LazyFlashGlowUltraPage = lazyDefault(
  () => import('./FlashGlowUltraPage'),
  'FlashGlowUltraPage'
);
