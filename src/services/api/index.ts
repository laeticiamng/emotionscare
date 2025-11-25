// Point 5: Services API Foundation - Export centralisé
export { httpClient as default, httpClient } from './httpClient';
export { mockServer } from './mockServer';
export * from '@/types/api';

// Services API spécialisés
export * from './endpoints';

// Services API Backend
export { scansApi } from './scansApi';
export type { ScanCreatePayload, ScanRecord, ScanListFilters, ScanStats } from './scansApi';

export { goalsApi } from './goalsApi';
export type { GoalCreatePayload, GoalUpdatePayload, GoalRecord, GoalStats } from './goalsApi';

export { coachSessionsApi } from './coachSessionsApi';
export type {
  CoachSessionCreatePayload,
  CoachSessionUpdatePayload,
  CoachMessagePayload,
  CoachSessionRecord,
  CoachMessageRecord,
  CoachAnalytics
} from './coachSessionsApi';

export { vrSessionsApi } from './vrSessionsApi';
export type {
  VRSessionCreatePayload,
  VRSessionUpdatePayload,
  VRSessionRecord,
  VRExperience,
  VRStats
} from './vrSessionsApi';

export { assessmentsApi } from './assessmentsApi';
export type {
  AssessmentCreatePayload,
  AssessmentSubmitPayload,
  AssessmentRecord,
  ClinicalInstrument,
  AssessmentResult,
  AssessmentStats
} from './assessmentsApi';

export { breathworkApi } from './breathworkApi';
export type {
  BreathworkSessionCreatePayload,
  BreathworkSessionUpdatePayload,
  BreathworkSessionRecord,
  BreathworkTechnique,
  BreathworkStats,
  BreathworkWeeklyMetrics
} from './breathworkApi';