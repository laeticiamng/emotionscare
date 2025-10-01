// @ts-nocheck
import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './AdaptiveMusicPage';
export { default as AdaptiveMusicPage } from './AdaptiveMusicPage';

export const LazyAdaptiveMusicPage = lazyDefault(
  () => import('./AdaptiveMusicPage'),
  'AdaptiveMusicPage'
);
