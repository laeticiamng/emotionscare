// @ts-nocheck
import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './CoachPage';
export { default as CoachPage } from './CoachPage';
export { CoachView } from './CoachView';
export { CoachConsent } from './CoachConsent';

export const LazyCoachPage = lazyDefault(
  () => import('./CoachPage'),
  'CoachPage'
);
