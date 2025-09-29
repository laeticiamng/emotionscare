import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './StorySynthPage';
export { default as StorySynthPage } from './StorySynthPage';

export const LazyStorySynthPage = lazyDefault(
  () => import('./StorySynthPage'),
  'StorySynthPage'
);
