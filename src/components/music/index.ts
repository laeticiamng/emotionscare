// Exports par défaut réexportés comme exports nommés pour éviter les conflits
export { default as AdaptiveMusicSettings } from './AdaptiveMusicSettings';
export { default as EmotionMusicIntegration } from './EmotionMusicIntegration';

// Player components - exports par défaut réexportés
export { default as MusicPlayer } from './player/MusicPlayer';
export { default as PremiumMusicPlayer } from './player/PremiumMusicPlayer';
export { default as PlayerControls } from './player/PlayerControls';
export { default as TrackInfo } from './player/TrackInfo';
export { default as ProgressBar } from './player/ProgressBar';
export { default as VolumeControl } from './player/VolumeControl';

// Music components
export { default as MusicMiniPlayer } from './MusicMiniPlayer';
export { default as EnhancedMusicRecommendations } from './EnhancedMusicRecommendations';
export { default as EmotionBasedMusicSelector } from './EmotionBasedMusicSelector';
export { default as MusicTherapy } from './MusicTherapy';
export { default as AudioVisualizer } from './AudioVisualizer';

// New enriched components
export { default as QuotaWarningBanner } from './QuotaWarningBanner';
export { default as OfflineDownloadButton } from './OfflineDownloadButton';
export { default as EmotionLinkBanner } from './EmotionLinkBanner';
export { default as MusicPageHeaderEnhanced } from './MusicPageHeaderEnhanced';
export { default as MusicStatsDrawer } from './MusicStatsDrawer';
export { default as PlaylistExportButton } from './PlaylistExportButton';
export { default as AudioSourceBadge } from './AudioSourceBadge';
export { default as RealTimeLyricsPanel } from './RealTimeLyricsPanel';
export { MusicLyricsSynchronized } from './MusicLyricsSynchronized';
export { default as TrackLyrics } from './TrackLyrics';

export { useMusicControls } from '@/hooks/useMusicControls';
export { useAdaptiveMusic } from '@/hooks/useAdaptiveMusic';

// Service - export nommé
export { adaptiveMusicService } from '@/services/adaptiveMusicService';

// Types - exports nommés
export type { MusicTrack, Playlist, MusicPlayerState, AdaptiveMusicConfig } from '@/types/music';