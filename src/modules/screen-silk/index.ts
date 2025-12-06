/**
 * Screen Silk Module - Micro-pauses écran
 */

export { screenSilkService } from './screen-silkService';
export { useScreenSilkMachine } from './useScreenSilkMachine';
export { default as SilkOverlay } from './ui/SilkOverlay';
export { default as BlinkGuide } from './ui/BlinkGuide';
export type { ScreenSilkConfig, ScreenSilkData, ScreenSilkState } from './useScreenSilkMachine';
export type { ScreenSilkMetrics, ScreenSilkSession } from './screen-silkService';