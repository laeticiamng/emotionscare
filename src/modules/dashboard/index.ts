/**
 * Module Dashboard - Tableau de bord
 * Service d'agrégation de statistiques du tableau de bord
 *
 * NOTE: Ce module est un service utilitaire.
 * Pour les composants UI dashboard, voir /src/pages/
 *
 * @module dashboard
 */

// ============================================================================
// SERVICE
// ============================================================================

export { DashboardService } from './dashboardService';

// ============================================================================
// TYPES
// ============================================================================

// Re-export des types depuis le service
export type {
  DashboardStats,
  ModuleActivity,
} from './dashboardService';
