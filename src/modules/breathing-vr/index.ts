/**
 * Point d'entrée du module breathing-vr
 */

export { BreathingVRMain } from './components/BreathingVRMain';
export { useBreathingVR } from './useBreathingVR';
export { BreathingVRService } from './breathingVRService';
export { PatternSelector } from './ui/PatternSelector';
export { BreathingScene } from './ui/BreathingScene';
export { BreathingControls } from './ui/BreathingControls';

export {
  BREATHING_PATTERNS,
  type BreathingPattern,
  type BreathingPhase,
  type BreathingConfig,
  type BreathingVRState,
  type BreathingSession
} from './types';
