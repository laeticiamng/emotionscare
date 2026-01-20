/**
 * Feature: Assessment
 * Évaluations psychométriques (WHO-5, GAD-7, PHQ-9, etc.)
 */

// API
export { startAssessment, submitAssessment } from './api';
export type { AssessmentStartOptions, AssessmentItem, AssessmentStartResponse } from './api';

// Hooks
export { useAssessment } from './useAssessment';
export type { UseAssessmentResult, AssessmentStage } from './useAssessment';

// Re-exports from hooks for compatibility
export { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
export { useImplicitAssess } from '@/hooks/useImplicitAssess';
export { useAssess } from '@/hooks/useAssess';
