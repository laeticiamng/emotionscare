import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './ScreenSilkPage';
export { default as ScreenSilkPage } from './ScreenSilkPage';

export const LazyScreenSilkPage = lazyDefault(
  () => import('./ScreenSilkPage'),
  'ScreenSilkPage'
);
