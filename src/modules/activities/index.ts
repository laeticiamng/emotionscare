/**
 * Point d'entrée du module activities
 * Module complet avec sessions, badges, statistiques et recommandations
 */

// Components
export { ActivitiesMain } from './components/ActivitiesMain';
export { ActivityDetailModal } from './components/ActivityDetailModal';
export { ActivityStats } from './components/ActivityStats';
export { ActivityBadges } from './components/ActivityBadges';
export { ActivityHistory } from './components/ActivityHistory';
export { ActivityRecommendations } from './components/ActivityRecommendations';

// UI
export { ActivityCard } from './ui/ActivityCard';
export { ActivityFilters } from './ui/ActivityFilters';

// Hooks
export { useActivities } from './useActivities';

// Services
export { ActivitiesService } from './activitiesService';
export { ActivitySessionService } from './services/activitySessionService';

// Alias pour compatibilité
export { ActivitiesService as ActivityService } from './activitiesService';

// Types
export type {
  ActivityCategory,
  ActivityDifficulty,
  Activity,
  UserActivity,
  ActivityFilters as ActivityFiltersType,
  ActivitiesState
} from './types';

export type {
  ActivitySession,
  ActivityStreak,
  ActivityBadge,
  UserActivityBadge
} from './services/activitySessionService';
