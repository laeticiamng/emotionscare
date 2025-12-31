/**
 * VR Galaxy Module - Exploration spatiale thérapeutique
 */

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export { VRGalaxyService, VRGalaxyServiceEnriched, vrGalaxyService } from './vrGalaxyServiceUnified';

// ============================================================================
// COMPONENTS
// ============================================================================

export { VRGalaxyMain } from './components/VRGalaxyMain';
export { GalaxySettingsPanel } from './components/GalaxySettingsPanel';
export type { GalaxySettings } from './components/GalaxySettingsPanel';
export { GalaxyStatsPanel } from './components/GalaxyStatsPanel';
export { GalaxyAchievementsPanel } from './components/GalaxyAchievementsPanel';
export { GalaxyExplorationMap } from './components/GalaxyExplorationMap';
export { GalaxySessionHistoryPanel } from './components/GalaxySessionHistoryPanel';

// ============================================================================
// HOOKS
// ============================================================================

export { useVRGalaxy } from './hooks/useVRGalaxy';
export { useVRGalaxyEnriched } from './hooks/useVRGalaxyEnriched';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';
