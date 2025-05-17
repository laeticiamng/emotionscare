
// Auth hooks
export { useAuth } from './useAuth';

// UI state hooks
export { useLocalStorage } from './useLocalStorage';
export { useMediaQuery } from './useMediaQuery';
export { useToast } from './use-toast';

// Feature-specific hooks
export { default as useAudioHandlers } from './use-audio';

// API hooks - removing incorrect imports that don't exist
// export * from './api/useCoachChat';
// export * from './api/useEmotionAPI';
// export * from './api/useFacialExpression';
export * from './api/useMusicGen';
// export * from './api/useVoiceAnalysis';

// User mode hooks
export { default as useUserModeHelpers } from './useUserModeHelpers';

// Reexport other valid hooks only
export { usePlaylistManager } from './usePlaylistManager';
export { useMusicService } from './useMusicService';
