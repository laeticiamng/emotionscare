// @ts-nocheck
import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './AdminFlagsPage';
export { default as AdminFlagsPage } from './AdminFlagsPage';

export const LazyAdminFlagsPage = lazyDefault(
  () => import('./AdminFlagsPage'),
  'AdminFlagsPage'
);
