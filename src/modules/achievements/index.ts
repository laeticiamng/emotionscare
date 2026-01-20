/**
 * Module Achievements
 * Gestion des succès, badges et progression utilisateur
 */

// ============================================================================
// SERVICE
// ============================================================================

export { achievementsService, default as defaultAchievementsService } from './achievementsService';

// ============================================================================
// HOOK
// ============================================================================

export { useAchievements } from './useAchievements';
export type { UseAchievementsReturn } from './useAchievements';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';
