/**
 * Music Feature
 *
 * Public exports for the music generation feature.
 */

// Export hooks
export { useMusicSessions, useMusicSession } from './hooks/useMusicSessions';
export { useCreateMusic } from './hooks/useCreateMusic';

// Export global music hooks (with fallback for missing modules)
export { useMusicTherapy } from '@/hooks/useMusicTherapy';

// Export services
export { musicApi } from './services/musicApi';
export { MusicTherapyService } from '@/modules/music-therapy';

// Export types from local services
export type { 
  MusicGenerationSession,
  CreateMusicGenerationInput,
  ListMusicSessionsInput 
} from './services/musicApi';

// Export types from music-therapy module
export type { 
  MusicTherapyStats,
  MusicRecommendation,
  ListeningPatterns,
  HistorySummary 
} from '@/modules/music-therapy/types';
