import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './BreathConstellationPage';
export { default as BreathConstellationPage } from './BreathConstellationPage';

export const LazyBreathConstellationPage = lazyDefault(
  () => import('./BreathConstellationPage'),
  'BreathConstellationPage'
);
