/**
 * Store Index - Centralized Zustand stores
 * All application state management exports
 */

// ============================================================================
// AUTH & USER
// ============================================================================
export { useAuthStore } from './useAuthStore';
export { useCartStore, type CartItem } from './cartStore';

// ============================================================================
// CORE FEATURES
// ============================================================================
export { useBreathStore } from './breath.store';
export { useMoodStore } from './mood.store';
export { useDashboardStore } from './dashboard.store';
export { useJournalStore } from './journal.store';
export { useSessionsStore } from './sessions.store';

// ============================================================================
// GAMIFICATION
// ============================================================================
export { useGamificationStore } from './gamification.store';
export { useRewardsStore } from './rewards.store';
export { useProgressionStore } from './progression.store';
export { useCollectionStore } from './collection.store';

// ============================================================================
// ACTIVITIES & MODULES
// ============================================================================
export { useActivityStore } from './activity.store';
export { useAmbitionStore } from './ambition.store';
export { useBounceStore } from './bounce.store';
export { useGlowStore } from './glow.store';
export { useGritStore } from './grit.store';
export { useMoodMixerStore } from './moodMixer.store';
export { useScreenSilkStore } from './screenSilk.store';
export { useStoryStore } from './story.store';

// ============================================================================
// VR & AR
// ============================================================================
export { useVRStore } from './vr.store';
export { useVRBreathStore } from './vrbreath.store';
export { useVRSafetyStore } from './vrSafety.store';
export { useARStore } from './ar.store';

// ============================================================================
// SYSTEM & SETTINGS
// ============================================================================
export { useAppStore } from './appStore';
export { useSettingsStore } from './settings.store';
export { useSystemStore } from './system.store';
export { useOnboardingStore } from './onboarding.store';
export { useAccountStore } from './account.store';

// ============================================================================
// ORGANIZATION & PRIVACY
// ============================================================================
export { useOrgStore } from './org.store';
export { usePrivacyStore } from './privacy.store';
export { useRGPDStore } from './rgpd.store';

// ============================================================================
// NOTIFICATIONS & FEEDBACK
// ============================================================================
export { useNotifyStore } from './notify.store';
export { useFeedbackStore } from './feedback.store';
export { useHelpStore } from './help.store';
export { useMarketingStore } from './marketing.store';

// ============================================================================
// BIOMETRICS
// ============================================================================
export { useHRStore } from './hr.store';

// ============================================================================
// UNIFIED STORE
// ============================================================================
export * from './unified.store';

// ============================================================================
// UTILITIES
// ============================================================================
export * from './hooks';
export * from './selectors';
