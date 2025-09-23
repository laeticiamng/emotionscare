import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './BossGritPage';
export { default as BossGritPage } from './BossGritPage';

export const LazyBossGritPage = lazyDefault(
  () => import('./BossGritPage'),
  'BossGritPage'
);
