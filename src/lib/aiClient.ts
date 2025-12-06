/**
 * Legacy AI client compatibility exports.
 *
 * Instead of relying on a barrel index file, we re-export each AI helper directly
 * so dependency rules stay explicit and dependency-cruiser can detect accidental cycles.
 */
export * from './ai/analytics-service';
export * from './ai/budgetMonitor';
export * from './ai/challenge-service';
export * from './ai/emotion-service';
export * from './ai/gdpr-service';
export * from './ai/hr-insights-service';
export * from './ai/journal-service';
export * from './ai/lyrics-service';
export * from './ai/modelSelector';
export * from './ai/moderation-service';
export * from './ai/openai-client';
export * from './ai/openai-config';
export * from './ai/vr-script-service';
