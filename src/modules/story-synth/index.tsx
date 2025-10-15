/**
 * Story Synth Module - Narration thérapeutique immersive
 */

export { useStorySynthMachine } from './useStorySynthMachine';
export * as storySynthService from './storySynthService';
export * from './types';

import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './StorySynthPage';
export { default as StorySynthPage } from './StorySynthPage';

export const LazyStorySynthPage = lazyDefault(
  () => import('./StorySynthPage'),
  'StorySynthPage'
);
