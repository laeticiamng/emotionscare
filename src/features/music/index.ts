/**
 * Music Feature
 *
 * Public exports for the music generation feature.
 */

// Export hooks
export { useMusicSessions, useMusicSession } from './hooks/useMusicSessions';
export { useCreateMusic } from './hooks/useCreateMusic';

// Export global music hooks
export { useMusicTherapy } from '@/hooks/useMusicTherapy';
export { useMusicAnalytics } from '@/hooks/useMusicAnalytics';
export { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';

// Export services
export { musicApi } from './services/musicApi';
export { MusicTherapyService } from '@/modules/music-therapy';

// Types
export type { MusicStats, WeeklyActivity, MoodTrend, TrackStat } from '@/hooks/useMusicAnalytics';

// Export components (when created)
// export { MusicGenerator } from './components/MusicGenerator';
// export { MusicPlayer } from './components/MusicPlayer';
// export { EmotionMusicMapper } from './components/EmotionMusicMapper';
