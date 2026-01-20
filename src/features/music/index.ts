/**
 * Feature: Music
 * Génération musicale, thérapie musicale, playlists
 */

// ============================================================================
// HOOKS - Re-export depuis le dossier hooks/music organisé
// ============================================================================
export { 
  useMusicRecommendation,
  useMusicStats,
  useMusicalCreation,
  useMusicControls,
  useMusicEmotionIntegration,
  useMusicSettings,
  useSunoPlayerSettings,
  useVolumeSettings,
  useVolumePresets,
  usePlaybackStats,
  useGenerationHistory,
  useGenerationStats,
  useMusicAccessibilitySettings,
  useQuotaIndicatorData,
  useMusicHistory,
  useLastPlayedTrack,
  useCachedTracks,
  useMusicQueue,
  useMusicPlayerFavorites,
  useMusicPlayerStats,
  useTrackRatings,
  useTrackPlayCounts,
  useShortcutsSeen,
  useMusicListeningStats,
  useEqualizerSettings,
  useLyricsGeneration,
  useSyncedLyrics,
  useMusicCache,
  useOfflineMusic,
  useHapticFeedback,
} from '@/hooks/music';

export type { EqualizerSettings, EqualizerPreset, MusicHookOptions } from '@/hooks/music';

// Hooks additionnels depuis racine
export { useMusicTherapy } from '@/hooks/useMusicTherapy';
export { useMusicGeneration } from '@/hooks/useMusicGeneration';
export { useMusicPlayer } from '@/hooks/useMusicPlayer';
export { useAdaptiveMusic } from '@/hooks/useAdaptiveMusic';
export { useAutoMix } from '@/hooks/useAutoMix';
export { usePlaylists } from '@/hooks/usePlaylists';
export { usePlaylistManager } from '@/hooks/usePlaylistManager';
export { usePlaylistShare } from '@/hooks/usePlaylistShare';
export { useMusicFavorites } from '@/hooks/useMusicFavorites';
export { useMusicAnalytics } from '@/hooks/useMusicAnalytics';
export { useMusicCorrelations } from '@/hooks/useMusicCorrelations';

// ============================================================================
// LOCAL HOOKS
// ============================================================================
export { useMusicSessions, useMusicSession } from './hooks/useMusicSessions';
export { useCreateMusic } from './hooks/useCreateMusic';

// ============================================================================
// SERVICES
// ============================================================================
export { musicApi } from './services/musicApi';
export { MusicTherapyService } from '@/modules/music-therapy';

// ============================================================================
// TYPES
// ============================================================================
export type { 
  MusicGenerationSession,
  CreateMusicGenerationInput,
  ListMusicSessionsInput 
} from './services/musicApi';

export type { 
  MusicTherapyStats,
  MusicRecommendation,
  ListeningPatterns,
  HistorySummary 
} from '@/modules/music-therapy/types';
