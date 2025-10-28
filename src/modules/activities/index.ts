/**
 * Point d'entrée du module activities
 * Fusion de activity/ et activities/ modules
 */

export { ActivitiesMain } from './components/ActivitiesMain';
export { useActivities } from './useActivities';
export { ActivitiesService } from './activitiesService';
export { ActivityCard } from './ui/ActivityCard';
export { ActivityFilters } from './ui/ActivityFilters';

// Alias pour compatibilité avec l'ancien module activity/
export { ActivitiesService as ActivityService } from './activitiesService';

export type {
  ActivityCategory,
  ActivityDifficulty,
  Activity,
  UserActivity,
  ActivityFilters as ActivityFiltersType,
  ActivitiesState
} from './types';
