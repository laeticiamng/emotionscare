
// Auth hooks
export { useAuth } from './useAuth';
export { default as usePasswordReset } from './usePasswordReset';
export { default as useLoginForm } from './useLoginForm';

// UI state hooks
export { default as useLocalStorage } from './useLocalStorage';
export { default as useMediaQuery } from './useMediaQuery';
export { default as useModal } from './useModal';
export { default as useOnboardingState } from './useOnboardingState';
export { default as useTheme } from './useTheme';
export { default as useToast } from './use-toast';

// Feature-specific hooks
export { default as useActivityData } from './useActivityData';
export { default as useAIAssistant } from './useAIAssistant';
export { default as useEmotion } from './useEmotion';
export { default as useEmotionAnalytics } from './useEmotionAnalytics';
export { default as useGamification } from './useGamification';
export { default as useJournal } from './useJournal';
export { default as useMeditation } from './useMeditation';
export { default as useMusicPlaylist } from './useMusicPlaylist';
export { default as useMusicService } from './useMusicService';
export { default as usePlaylistManager } from './usePlaylistManager';
export { default as useScanHistory } from './useScanHistory';
export { default as useScanResults } from './useScanResults';
export { default as useSubscription } from './useSubscription';
export { default as useUserSettings } from './useUserSettings';
export { default as useVoiceInput } from './useVoiceInput';
export { default as useVoiceRecognition } from './useVoiceRecognition';

// API hooks
export * from './api/useCoachChat';
export * from './api/useEmotionAPI';
export * from './api/useFacialExpression';
export * from './api/useMusicGen';
export * from './api/useVoiceAnalysis';

// Remove incorrect import
// export * from './community-gamification';

// User mode hooks
export { default as useUserModeHelpers } from './useUserModeHelpers';

// Typescript types
export * from './types';
