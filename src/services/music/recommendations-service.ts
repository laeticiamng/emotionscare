/**
 * Service de recommandations musicales personnalisées
 * Basé sur l'apprentissage automatique des préférences
 */

import { MusicTrack } from '@/types/music';
import { analyzeMusicBehavior } from './preferences-learning-service';
import { logger } from '@/lib/logger';

export interface PersonalizedPlaylist {
  id: string;
  name: string;
  description: string;
  tracks: MusicTrack[];
  matchScore: number; // 0-100
  basedOn: string[]; // genres/moods utilisés
  coverUrl?: string;
  isFavorite?: boolean;
}

/**
 * Génère des playlists personnalisées basées sur l'historique d'écoute
 */
/**
 * Analyser localement l'historique pour générer des stats
 */
function analyzeLocalHistory(history: any[]) {
  const genreCounts: Record<string, number> = {};
  const moodCounts: Record<string, number> = {};
  
  history.forEach(entry => {
    const genre = entry.genre || entry.tags?.[0] || 'unknown';
    const mood = entry.mood || 'calm';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  
  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: (count / history.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
  
  const topMoods = Object.entries(moodCounts)
    .map(([mood, count]) => ({
      mood,
      count,
      percentage: (count / history.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
  
  return { topGenres, topMoods };
}

export async function generatePersonalizedPlaylists(
  userId: string,
  listeningHistory: any[]
): Promise<PersonalizedPlaylist[]> {
  try {
    // Analyser le comportement musical localement
    const { topGenres, topMoods } = analyzeLocalHistory(listeningHistory);
    
    const playlists: PersonalizedPlaylist[] = [];
    
    // Playlist basée sur les genres favoris
    if (topGenres.length > 0) {
      playlists.push({
        id: `playlist-genres-${Date.now()}`,
        name: `Your ${topGenres[0].genre} Mix`,
        description: `Basé sur votre amour pour ${topGenres[0].genre}`,
        tracks: generateMockTracks(topGenres[0].genre, 12),
        matchScore: Math.round(topGenres[0].percentage),
        basedOn: [topGenres[0].genre],
        coverUrl: `/covers/${topGenres[0].genre.toLowerCase()}.jpg`
      });
    }
    
    // Playlist basée sur les moods
    if (topMoods.length > 0) {
      playlists.push({
        id: `playlist-moods-${Date.now()}`,
        name: `${topMoods[0].mood} Vibes`,
        description: `Pour vos moments ${topMoods[0].mood}`,
        tracks: generateMockTracks(topMoods[0].mood, 10),
        matchScore: Math.round(topMoods[0].percentage),
        basedOn: [topMoods[0].mood],
        coverUrl: `/covers/${topMoods[0].mood.toLowerCase()}.jpg`
      });
    }
    
    // Playlist découverte
    playlists.push({
      id: `playlist-discovery-${Date.now()}`,
      name: 'Discover Weekly',
      description: 'Nouveaux genres basés sur vos goûts',
      tracks: generateMockTracks('discovery', 15),
      matchScore: 85,
      basedOn: ['discovery', ...topGenres.slice(0, 2).map(g => g.genre)],
      coverUrl: '/covers/discovery.jpg'
    });
    
    logger.info('Generated personalized playlists', { count: playlists.length }, 'MUSIC');
    return playlists;
  } catch (error) {
    logger.error('Failed to generate playlists', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Génère des tracks mock pour une playlist
 */
function generateMockTracks(theme: string, count: number): MusicTrack[] {
  const tracks: MusicTrack[] = [];
  
  for (let i = 1; i <= count; i++) {
    tracks.push({
      id: `track-${theme}-${i}`,
      title: `${theme} Track ${i}`,
      artist: `Artist ${i}`,
      duration: 180 + Math.random() * 120,
      url: '/samples/preview-30s.mp3',
      audioUrl: '/samples/preview-30s.mp3',
      coverUrl: `/covers/${theme.toLowerCase()}.jpg`
    });
  }
  
  return tracks;
}

/**
 * Ajoute une playlist aux favoris
 */
export async function togglePlaylistFavorite(
  userId: string,
  playlistId: string
): Promise<boolean> {
  try {
    // TODO: Implémenter avec Supabase
    logger.info('Toggled playlist favorite', { userId, playlistId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Failed to toggle favorite', error as Error, 'MUSIC');
    return false;
  }
}
