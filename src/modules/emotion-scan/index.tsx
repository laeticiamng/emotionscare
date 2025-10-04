import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './EmotionScanPage';
export { default as EmotionScanPage } from './EmotionScanPage';

export const LazyEmotionScanPage = lazyDefault(
  () => import('./EmotionScanPage'),
  'EmotionScanPage'
);
