/**
 * Screen Silk Module - Micro-pauses écran
 * @module screen-silk
 */

import { lazyDefault } from '@/lib/lazyDefault';

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export * as screenSilkService from './screenSilkServiceUnified';

// ============================================================================
// HOOKS
// ============================================================================

export { useScreenSilkMachine } from './useScreenSilkMachine';
export type { ScreenSilkConfig, ScreenSilkState, ScreenSilkData } from './useScreenSilkMachine';

// ============================================================================
// UI COMPONENTS
// ============================================================================

export { default as SilkOverlay } from './ui/SilkOverlay';
export { default as BlinkGuide } from './ui/BlinkGuide';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';

// ============================================================================
// PAGE
// ============================================================================

export { default } from './ScreenSilkPage';
export { default as ScreenSilkPage } from './ScreenSilkPage';

export const LazyScreenSilkPage = lazyDefault(
  () => import('./ScreenSilkPage'),
  'ScreenSilkPage'
);
