// Centralized Music Hooks - Unified exports
export { default as useMusicRecommendation } from '../useMusicRecommendation';
export { default as useMusicStats } from '../useMusicStats';
export { useMusicalCreation } from '../useMusicalCreation';
export { useMusic } from '@/contexts/MusicContext';
export { useMusicControls } from '../useMusicControls';
export { useMusicEmotionIntegration } from '../useMusicEmotionIntegration';

// Settings & Persistence
export { useMusicSettings, useSunoPlayerSettings } from './useMusicSettings';
export { useVolumeSettings, useVolumePresets } from './useMusicSettings';
export { usePlaybackStats, useGenerationHistory, useGenerationStats } from './useMusicSettings';
export { useMusicAccessibilitySettings, useQuotaIndicatorData } from './useMusicSettings';
export { useMusicHistory, useLastPlayedTrack } from './useMusicSettings';
export { useCachedTracks, useMusicQueue, useMusicPlayerFavorites } from './useMusicSettings';
export { useMusicPlayerStats, useTrackRatings, useTrackPlayCounts } from './useMusicSettings';
export { useShortcutsSeen } from './useMusicSettings';

// Listening Stats - Hook complet avec données Supabase
export { default as useMusicListeningStats } from './useMusicListeningStats';

// Equalizer
export { useEqualizerSettings } from './useEqualizerSettings';
export type { EqualizerSettings, EqualizerPreset } from './useEqualizerSettings';

// Lyrics & Cache
export { useLyricsGeneration } from './useLyricsGeneration';
export { useSyncedLyrics } from './useSyncedLyrics';
export { useMusicCache } from './useMusicCache';
export { useOfflineMusic } from './useOfflineMusic';

// Haptic feedback for mobile
export { useHapticFeedback } from './useHapticFeedback';

// Re-export for backward compatibility
export type { MusicHookOptions } from '../useMusicRecommendation';