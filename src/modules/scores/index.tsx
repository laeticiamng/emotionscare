import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './ScoresV2Page';
export { default as ScoresV2Page } from './ScoresV2Page';
export { default as ScoresV2Panel } from './ScoresV2Panel';

export const LazyScoresV2Page = lazyDefault(
  () => import('./ScoresV2Page'),
  'ScoresV2Page'
);
