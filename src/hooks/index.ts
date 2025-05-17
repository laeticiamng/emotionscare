
// Auth hooks
export { useAuth } from './useAuth';

// UI state hooks
export { useLocalStorage } from './useLocalStorage';
export { useMediaQuery } from './useMediaQuery';
export { useToast, toast, error, success, warning, info } from './use-toast';

// Feature-specific hooks
export { default as useAudio } from './use-audio';
export { useAudioPlayer } from './useAudioPlayer';

// API hooks
export * from './api/useMusicGen';

// User mode hooks
export { default as useUserModeHelpers } from './useUserModeHelpers';

// Reexport other valid hooks only
export { usePlaylistManager } from './usePlaylistManager';
export { useMusicService } from './useMusicService';
export { useMusicEmotionIntegration } from './useMusicEmotionIntegration';
export { default as useMusicRecommendation } from './useMusicRecommendation';

// Emotion hooks
export { default as useEmotionScan } from './useEmotionScan';

// Theme hook
export { useTheme } from './use-theme';
