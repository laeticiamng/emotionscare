/**
 * Store exports - Centralized state management
 */

// Auth stores
export * from './useAuthStore';

// Cart store
export * from './cartStore';

// App stores - Primary exports
// Note: unified.store has priority for useAppStore
export * from './unified.store';

// Individual stores (some may have type conflicts, import directly if needed)
export * from './account.store';
export * from './activity.store';
export * from './ambition.store';
export * from './ar.store';
export * from './bounce.store';
export * from './collection.store';
export * from './dashboard.store';
export * from './feedback.store';
export * from './glow.store';
export * from './help.store';
export * from './hr.store';
export * from './journal.store';
export * from './marketing.store';
export * from './moodMixer.store';
export * from './notify.store';
export * from './onboarding.store';
export * from './org.store';
export * from './privacy.store';
export * from './progression.store';
export * from './rgpd.store';
export * from './screenSilk.store';
export * from './sessions.store';
export * from './story.store';
export * from './system.store';
export * from './vr.store';
export * from './vrSafety.store';
export * from './vrbreath.store';

// Additional stores and utilities
export * from './useGlowBreathStore';
export * from './hooks';
export * from './selectors';

// NOTE: The following stores have type conflicts and should be imported directly when needed:
// - appStore.ts (conflicts with unified.store for useAppStore - unified.store takes priority)
// - breath.store.ts (conflicts for useBreathStore - import directly)
// - breathSlice.ts (conflicts for useBreathStore - import directly)
// - useBreathStore.ts (conflicts with breath.store/breathSlice - import directly)
// - gamification.store.ts (Badge type conflicts with rewards.store - import directly)
// - rewards.store.ts (Badge type conflicts with gamification.store - import directly)
// - grit.store.ts (HumeSummary type conflicts with mood.store - import directly)
// - mood.store.ts (HumeSummary type conflicts with grit.store - import directly)
// - settings.store.ts (Theme type conflicts with appStore - import directly)
