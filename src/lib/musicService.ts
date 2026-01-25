import { logger } from '@/lib/logger';

// Re-export everything from the service modules
export { getPlaylist } from '@/services/music/playlist-service';
export { saveUserCurrentTrack, getUserListeningHistory } from '@/services/music/user-service';
export { 
  trackToMusicTrack, 
  playlistToMusicPlaylist,
  musicTrackToTrack,
  musicPlaylistToPlaylist 
} from '@/services/music/converters';
// Import depuis la source unique (consolidation Phase 2)
export type { MusicTrack as Track, MusicPlaylist as Playlist } from '@/types/music';

// Fonctions pour les VR audio sessions
export const getAudioSessions = async () => {
  try {
    // Simulation for now
    return [
      {
        id: 'meditation-1',
        title: 'Méditation pleine conscience',
        description: 'Une séance de 10 minutes pour se recentrer',
        duration: 600, // seconds
        audio_url: '/audio/meditation1.mp3',
        type: 'meditation'
      },
      {
        id: 'relaxation-1',
        title: 'Relaxation profonde',
        description: 'Détendez votre corps et votre esprit',
        duration: 900, // seconds
        audio_url: '/audio/relaxation1.mp3',
        type: 'relaxation'
      }
    ];
  } catch (error) {
    logger.error('Error fetching audio sessions', error as Error, 'MUSIC');
    throw error;
  }
};

// Pour les recommandations basées sur les émotions
export const getRecommendedTracks = async (_emotion: string) => {
  try {
    // This would typically come from an API
    // For now we'll just return mock data
    return [
      {
        id: 'track1',
        title: 'Sérénité absolue',
        artist: 'Nature Sounds',
        album: 'Calm Collection',
        duration: 180,
        url: '/audio/track1.mp3',
        cover_url: '/images/track1-cover.jpg'
      },
      {
        id: 'track2',
        title: 'Évasion mentale',
        artist: 'Mindfulness Masters',
        album: 'Deep Focus',
        duration: 240,
        url: '/audio/track2.mp3',
        cover_url: '/images/track2-cover.jpg'
      }
    ];
  } catch (error) {
    logger.error('Error fetching recommended tracks', error as Error, 'MUSIC');
    throw error;
  }
};
