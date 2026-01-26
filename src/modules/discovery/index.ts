/**
 * Module Discovery - Exploration émotionnelle
 * Service, hooks et types pour la découverte personnalisée
 *
 * @module discovery
 */

// ============================================================================
// SERVICE
// ============================================================================

export { DiscoveryService, discoveryService } from './discoveryService';
export type {
  DiscoveryRecommendation as ServiceDiscoveryRecommendation,
  DiscoveryRecommendationsResponse,
  TrendingResponse,
  ExploreResponse,
  SearchResponse,
} from './discoveryService';

// ============================================================================
// PAGES
// ============================================================================

export { default as DiscoveryPage } from './pages/DiscoveryPage';

// ============================================================================
// COMPONENTS
// ============================================================================

export { DiscoveryCard } from './components/DiscoveryCard';
export { DiscoveryStatsPanel } from './components/DiscoveryStats';
export { DiscoveryFiltersPanel } from './components/DiscoveryFilters';
export { DiscoveryPathsPanel } from './components/DiscoveryPaths';
export { DiscoveryRecommendationsPanel } from './components/DiscoveryRecommendations';
export { DiscoverySessionPanel } from './components/DiscoverySession';
export { DiscoveryAchievementsPanel } from './components/DiscoveryAchievements';

// ============================================================================
// HOOKS
// ============================================================================

export { useDiscovery } from './hooks/useDiscovery';

// ============================================================================
// TYPES
// ============================================================================

export type {
  DiscoveryCategory,
  DifficultyLevel,
  DiscoveryStatus,
  DiscoveryItem,
  DiscoveryPath,
  DiscoveryStats,
  DiscoveryAchievement,
  DiscoveryRecommendation,
  DiscoveryFilters,
  DiscoverySettings,
  DiscoverySession,
  DiscoveryState,
} from './types';
