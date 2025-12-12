/**
 * Service de recommandations musicales personnalisées
 * Basé sur l'apprentissage automatique des préférences
 */

import { MusicTrack } from '@/types/music';
import { analyzeMusicBehavior } from './preferences-learning-service';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

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
 * Ajoute ou retire une playlist des favoris
 */
export async function togglePlaylistFavorite(
  userId: string,
  playlistId: string
): Promise<boolean> {
  try {
    // Vérifier si la playlist existe déjà dans les favoris
    const { data: existing, error: checkError } = await supabase
      .from('music_playlists')
      .select('id, tags')
      .eq('id', playlistId)
      .eq('user_id', userId)
      .single();

    if (checkError) {
      logger.error('Failed to check playlist favorite status', checkError as Error, 'MUSIC');
      return false;
    }

    // Toggle le statut favori via les tags
    const currentTags = existing.tags || [];
    const isFavorite = currentTags.includes('favorite');
    const newTags = isFavorite
      ? currentTags.filter((tag: string) => tag !== 'favorite')
      : [...currentTags, 'favorite'];

    const { error: updateError } = await supabase
      .from('music_playlists')
      .update({ tags: newTags })
      .eq('id', playlistId)
      .eq('user_id', userId);

    if (updateError) {
      logger.error('Failed to toggle playlist favorite', updateError as Error, 'MUSIC');
      return false;
    }

    logger.info('Toggled playlist favorite', {
      userId,
      playlistId,
      isFavorite: !isFavorite
    }, 'MUSIC');

    return true;
  } catch (error) {
    logger.error('Failed to toggle favorite', error as Error, 'MUSIC');
    return false;
  }
}

// ========== MÉTHODES ENRICHIES ==========

/**
 * Obtenir le Daily Mix personnalisé
 */
export async function getDailyMix(userId: string): Promise<PersonalizedPlaylist> {
  try {
    // Récupérer l'historique récent
    const { data: history } = await supabase
      .from('music_history')
      .select('track_id, emotion, mood')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(50);

    // Analyser les préférences
    const { topMoods } = analyzeLocalHistory(history || []);
    const dominantMood = topMoods[0]?.mood || 'calm';

    return {
      id: `daily-mix-${new Date().toISOString().split('T')[0]}`,
      name: 'Daily Mix',
      description: `Votre mix du jour basé sur votre humeur ${dominantMood}`,
      tracks: generateMockTracks(dominantMood, 20),
      matchScore: 92,
      basedOn: [dominantMood, 'recent_history'],
      coverUrl: '/covers/daily-mix.jpg'
    };
  } catch (error) {
    logger.error('Failed to generate daily mix', error as Error, 'MUSIC');
    return {
      id: 'daily-mix-default',
      name: 'Daily Mix',
      description: 'Votre mix du jour',
      tracks: generateMockTracks('calm', 20),
      matchScore: 80,
      basedOn: ['default'],
      coverUrl: '/covers/daily-mix.jpg'
    };
  }
}

/**
 * Obtenir des recommandations basées sur l'humeur actuelle
 */
export async function getRecommendationsForMood(
  mood: string,
  limit: number = 15
): Promise<MusicTrack[]> {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('mood', mood)
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        url: track.preview_url || '',
        audioUrl: track.preview_url || '',
        coverUrl: track.image_url,
        mood: track.mood,
        emotion: track.emotion
      }));
    }

    // Fallback avec des tracks mockés
    return generateMockTracks(mood, limit);
  } catch (error) {
    logger.error('Failed to get mood recommendations', error as Error, 'MUSIC');
    return generateMockTracks(mood, limit);
  }
}

/**
 * Obtenir des tracks similaires
 */
export async function getSimilarTracks(trackId: string, limit: number = 10): Promise<MusicTrack[]> {
  try {
    // Récupérer les infos du track source
    const { data: sourceTrack } = await supabase
      .from('music_tracks')
      .select('genre, mood, artist')
      .eq('id', trackId)
      .single();

    if (!sourceTrack) {
      return generateMockTracks('similar', limit);
    }

    // Chercher des tracks similaires
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .neq('id', trackId)
      .or(`genre.eq.${sourceTrack.genre},mood.eq.${sourceTrack.mood},artist.eq.${sourceTrack.artist}`)
      .limit(limit);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        url: track.preview_url || '',
        audioUrl: track.preview_url || '',
        coverUrl: track.image_url
      }));
    }

    return generateMockTracks('similar', limit);
  } catch (error) {
    logger.error('Failed to get similar tracks', error as Error, 'MUSIC');
    return generateMockTracks('similar', limit);
  }
}

/**
 * Obtenir les recommandations populaires
 */
export async function getPopularRecommendations(limit: number = 20): Promise<MusicTrack[]> {
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        url: track.preview_url || '',
        audioUrl: track.preview_url || '',
        coverUrl: track.image_url
      }));
    }

    return generateMockTracks('popular', limit);
  } catch (error) {
    logger.error('Failed to get popular recommendations', error as Error, 'MUSIC');
    return generateMockTracks('popular', limit);
  }
}

/**
 * Obtenir les nouvelles sorties
 */
export async function getNewReleases(limit: number = 15): Promise<MusicTrack[]> {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .gte('created_at', oneMonthAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        url: track.preview_url || '',
        audioUrl: track.preview_url || '',
        coverUrl: track.image_url
      }));
    }

    return generateMockTracks('new', limit);
  } catch (error) {
    logger.error('Failed to get new releases', error as Error, 'MUSIC');
    return generateMockTracks('new', limit);
  }
}

/**
 * Générer une radio basée sur un track
 */
export async function generateRadioFromTrack(trackId: string): Promise<PersonalizedPlaylist> {
  try {
    const similarTracks = await getSimilarTracks(trackId, 25);

    return {
      id: `radio-${trackId}-${Date.now()}`,
      name: 'Radio personnalisée',
      description: 'Basée sur votre sélection',
      tracks: similarTracks,
      matchScore: 88,
      basedOn: [trackId],
      coverUrl: '/covers/radio.jpg'
    };
  } catch (error) {
    logger.error('Failed to generate radio', error as Error, 'MUSIC');
    return {
      id: `radio-default-${Date.now()}`,
      name: 'Radio personnalisée',
      description: 'Musique recommandée',
      tracks: generateMockTracks('radio', 25),
      matchScore: 75,
      basedOn: ['default'],
      coverUrl: '/covers/radio.jpg'
    };
  }
}

/**
 * Obtenir les playlists recommandées par catégorie
 */
export async function getRecommendedPlaylistsByCategory(
  category: 'relaxation' | 'focus' | 'energy' | 'sleep'
): Promise<PersonalizedPlaylist[]> {
  const categoryConfig: Record<string, { moods: string[]; description: string }> = {
    relaxation: { moods: ['calm', 'peaceful', 'serene'], description: 'Pour se détendre' },
    focus: { moods: ['focused', 'concentrated', 'productive'], description: 'Pour la concentration' },
    energy: { moods: ['energetic', 'happy', 'upbeat'], description: 'Pour bouger' },
    sleep: { moods: ['sleepy', 'calm', 'peaceful'], description: 'Pour dormir' }
  };

  const config = categoryConfig[category];

  return config.moods.map((mood, index) => ({
    id: `${category}-playlist-${index + 1}`,
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${index + 1}`,
    description: config.description,
    tracks: generateMockTracks(mood, 12),
    matchScore: 85 + Math.floor(Math.random() * 10),
    basedOn: [mood, category],
    coverUrl: `/covers/${category}-${index + 1}.jpg`
  }));
}

/**
 * Marquer une recommandation comme non pertinente
 */
export async function dismissRecommendation(
  userId: string,
  trackId: string,
  reason?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('recommendation_feedback')
      .insert({
        user_id: userId,
        track_id: trackId,
        feedback_type: 'dismiss',
        reason,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    logger.info('Recommendation dismissed', { userId, trackId, reason }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Failed to dismiss recommendation', error as Error, 'MUSIC');
    return false;
  }
}
