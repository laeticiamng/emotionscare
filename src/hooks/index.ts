
// Auth hooks
export { useAuth } from './useAuth';

// UI state hooks
export { useLocalStorage } from './useLocalStorage';
export { useMediaQuery } from './useMediaQuery';
export { useToast, toast, error, success, warning, info } from './use-toast';

// Feature-specific hooks
export { default as useAudioHandlers } from './use-audio';

// API hooks - removing incorrect imports that don't exist
export * from './api/useMusicGen';

// User mode hooks
export { default as useUserModeHelpers } from './useUserModeHelpers';

// Reexport other valid hooks only
export { usePlaylistManager } from './usePlaylistManager';
export { useMusicService } from './useMusicService';

// Theme hook
export { useTheme } from './use-theme';
