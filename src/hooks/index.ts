
// Auth hooks re-exported from the global AuthContext
export { useAuth } from '@/contexts/AuthContext';

// UI state hooks
export { useLocalStorage } from './useLocalStorage';
export { useMediaQuery } from './useMediaQuery';
export { useToast, toast, error, success, warning, info } from './use-toast';

// Feature-specific hooks
export { default as useAudio } from './use-audio';
export { useAudioPlayer } from './useAudioPlayer';

// Music hooks - centralized
export { useMusic } from './useMusic';
export { useMusicControls } from './useMusicControls';
export { useMusicGen } from './api/useMusicGen';
export { useExtensions } from '@/providers/ExtensionsProvider';

// User mode hooks
export { default as useUserModeHelpers } from './useUserModeHelpers';

// Reexport other valid hooks only
export { usePlaylistManager } from './usePlaylistManager';
export { useMusicService } from './useMusicService';
export { useMusicEmotionIntegration } from './useMusicEmotionIntegration';
export { default as useMusicRecommendation } from './useMusicRecommendation';

// Emotion hooks
export { useEmotionScan } from './useEmotionScan';

// Theme hook
export { useTheme } from './use-theme';

// Chat hooks
export { useChat } from './useChat';
