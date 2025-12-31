/**
 * VR Nebula Module - Expérience VR de respiration
 */

export * from './types';
export * as vrNebulaService from './vrNebulaService';
export { useVRNebulaMachine } from './useVRNebulaMachine';
export { useVRNebula } from './useVRNebula';
export { 
  VRNebulaSessionPanel, 
  VRNebulaStatsPanel, 
  VRNebulaHistoryPanel 
} from './components';
export type { VRNebulaState, NebulaPhase } from './types';
