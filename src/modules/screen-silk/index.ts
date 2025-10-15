/**
 * Screen Silk Module - Micro-pauses écran
 */

export * from './types';
export * as screenSilkService from './screenSilkServiceUnified';
export { useScreenSilkMachine } from './useScreenSilkMachine';
export type { ScreenSilkConfig, ScreenSilkState, ScreenSilkData } from './useScreenSilkMachine';
export { default as SilkOverlay } from './ui/SilkOverlay';
export { default as BlinkGuide } from './ui/BlinkGuide';

// Legacy exports (deprecated)
/**
 * @deprecated Use screenSilkService from './screenSilkServiceUnified' instead
 */
export { screenSilkService as screenSilkServiceLegacy } from './screen-silkService';