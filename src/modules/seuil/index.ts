/**
 * Module SEUIL - Régulation émotionnelle proactive
 * Détecte et accompagne le moment fragile avant le décrochage
 */

// ============================================================================
// SERVICE
// ============================================================================

export { SeuilService, seuilService } from './seuilService';
export type { SeuilSession, SeuilSettings, SeuilStats, SeuilPrediction } from './seuilService';

// ============================================================================
// COMPONENTS, HOOKS, TYPES, CONSTANTS
// ============================================================================

export * from './components';
export * from './hooks';
export * from './types';
export * from './constants';
