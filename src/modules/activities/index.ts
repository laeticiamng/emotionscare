/**
 * Point d'entrée du module activities
 */

export { ActivitiesMain } from './components/ActivitiesMain';
export { useActivities } from './useActivities';
export { ActivitiesService } from './activitiesService';
export { ActivityCard } from './ui/ActivityCard';
export { ActivityFilters } from './ui/ActivityFilters';

export type {
  ActivityCategory,
  ActivityDifficulty,
  Activity,
  UserActivity,
  ActivityFilters as ActivityFiltersType,
  ActivitiesState
} from './types';
