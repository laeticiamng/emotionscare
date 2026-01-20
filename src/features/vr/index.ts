/**
 * Feature: VR Experiences
 * Expériences immersives en réalité virtuelle
 */

// Orchestrators
export { computeBreathActions, type VRActions } from './vrBreath.orchestrator';
export { computeGalaxyActions } from './vrGalaxy.orchestrator';

// Hooks
export { useVRTier } from './useVRTier';

// Utils
export { deriveBreathProfile, deriveGalaxyProfile } from './deriveProfile';

// Types
export * from './types';

// Re-exports from modules for compatibility
export { VRGalaxyMain, useVRGalaxy } from '@/modules/vr-galaxy';
