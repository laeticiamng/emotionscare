/**
 * Story Synth Module - Narration thérapeutique immersive
 */

export * from './types';
export * as storySynthService from './storySynthService';
export { useStorySynthMachine } from './useStorySynthMachine';
export type { StorySynthState, StorySynthPhase } from './types';

import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './StorySynthPage';
export { default as StorySynthPage } from './StorySynthPage';

export const LazyStorySynthPage = lazyDefault(
  () => import('./StorySynthPage'),
  'StorySynthPage'
);
