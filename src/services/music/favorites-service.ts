/**
 * Music Favorites Service
 * Gestion des favoris utilisateur avec Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';

export interface FavoriteTrack {
  id: string;
  user_id: string;
  track_id: string;
  track_title: string | null;
  track_artist: string | null;
  track_url: string | null;
  created_at: string;
}

/**
 * Ajouter un track aux favoris
 */
export async function saveFavorite(track: MusicTrack): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('music_favorites')
      .insert({
        user_id: user.id,
        track_id: track.id,
        track_title: track.title,
        track_artist: track.artist,
        track_url: track.audioUrl || track.url,
      });

    if (error) {
      // Si erreur de conflit (déjà favori), on ignore
      if (error.code === '23505') {
        logger.debug('Track already in favorites', { trackId: track.id }, 'MUSIC');
        return { success: true };
      }
      throw error;
    }

    logger.info('Track added to favorites', { trackId: track.id }, 'MUSIC');
    return { success: true };
  } catch (error) {
    logger.error('Failed to save favorite', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Retirer un track des favoris
 */
export async function removeFavorite(trackId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('music_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('track_id', trackId);

    if (error) throw error;

    logger.info('Track removed from favorites', { trackId }, 'MUSIC');
    return { success: true };
  } catch (error) {
    logger.error('Failed to remove favorite', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Récupérer tous les favoris de l'utilisateur
 */
export async function getUserFavorites(): Promise<FavoriteTrack[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('Cannot fetch favorites: user not authenticated', undefined, 'MUSIC');
      return [];
    }

    const { data, error } = await supabase
      .from('music_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to fetch favorites', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Vérifier si un track est dans les favoris
 */
export async function isFavorite(trackId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data, error } = await supabase
      .from('music_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('track_id', trackId)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    logger.error('Failed to check favorite status', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Obtenir le nombre de favoris de l'utilisateur
 */
export async function getFavoritesCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 0;

    // Compter directement au lieu d'utiliser une RPC inexistante
    const { error, count } = await supabase
      .from('music_favorites')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    logger.error('Failed to get favorites count', error as Error, 'MUSIC');
    return 0;
  }
}

/**
 * Synchroniser les favoris locaux avec la DB
 * Utile après reconnexion ou refresh
 */
export async function syncFavorites(localFavoriteIds: string[]): Promise<string[]> {
  try {
    const dbFavorites = await getUserFavorites();
    const dbFavoriteIds = dbFavorites.map(f => f.track_id);

    // Merge sans doublons
    const merged = Array.from(new Set([...dbFavoriteIds, ...localFavoriteIds]));

    logger.debug('Favorites synced', {
      local: localFavoriteIds.length,
      db: dbFavoriteIds.length,
      merged: merged.length
    }, 'MUSIC');

    return merged;
  } catch (error) {
    logger.error('Failed to sync favorites', error as Error, 'MUSIC');
    return localFavoriteIds; // Fallback sur local
  }
}

// ========== MÉTHODES ENRICHIES ==========

/**
 * Obtenir les favoris par artiste
 */
export async function getFavoritesByArtist(): Promise<Record<string, FavoriteTrack[]>> {
  try {
    const favorites = await getUserFavorites();
    const byArtist: Record<string, FavoriteTrack[]> = {};

    favorites.forEach(fav => {
      const artist = fav.track_artist || 'Unknown';
      if (!byArtist[artist]) byArtist[artist] = [];
      byArtist[artist].push(fav);
    });

    return byArtist;
  } catch (error) {
    logger.error('Failed to get favorites by artist', error as Error, 'MUSIC');
    return {};
  }
}

/**
 * Obtenir les favoris récents
 */
export async function getRecentFavorites(limit: number = 10): Promise<FavoriteTrack[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('music_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Failed to get recent favorites', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Toggle favori (ajouter si absent, supprimer si présent)
 */
export async function toggleFavorite(track: MusicTrack): Promise<{ isFavorite: boolean; error?: string }> {
  try {
    const isCurrentlyFavorite = await isFavorite(track.id);

    if (isCurrentlyFavorite) {
      const result = await removeFavorite(track.id);
      return { isFavorite: false, error: result.error };
    } else {
      const result = await saveFavorite(track);
      return { isFavorite: true, error: result.error };
    }
  } catch (error) {
    logger.error('Failed to toggle favorite', error as Error, 'MUSIC');
    return { isFavorite: false, error: (error as Error).message };
  }
}

/**
 * Exporter les favoris en JSON
 */
export async function exportFavorites(): Promise<string> {
  try {
    const favorites = await getUserFavorites();
    return JSON.stringify(favorites, null, 2);
  } catch (error) {
    logger.error('Failed to export favorites', error as Error, 'MUSIC');
    return '[]';
  }
}

/**
 * Obtenir les statistiques des favoris
 */
export async function getFavoritesStats(): Promise<{
  totalCount: number;
  uniqueArtists: number;
  oldestFavorite: string | null;
  newestFavorite: string | null;
  topArtist: { name: string; count: number } | null;
}> {
  try {
    const favorites = await getUserFavorites();

    if (favorites.length === 0) {
      return {
        totalCount: 0, uniqueArtists: 0, oldestFavorite: null,
        newestFavorite: null, topArtist: null
      };
    }

    const artistCounts: Record<string, number> = {};
    favorites.forEach(f => {
      const artist = f.track_artist || 'Unknown';
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    });

    const uniqueArtists = Object.keys(artistCounts).length;
    const topArtistEntry = Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const sorted = [...favorites].sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return {
      totalCount: favorites.length,
      uniqueArtists,
      oldestFavorite: sorted[0]?.created_at || null,
      newestFavorite: sorted[sorted.length - 1]?.created_at || null,
      topArtist: topArtistEntry ? { name: topArtistEntry[0], count: topArtistEntry[1] } : null
    };
  } catch (error) {
    logger.error('Failed to get favorites stats', error as Error, 'MUSIC');
    return {
      totalCount: 0, uniqueArtists: 0, oldestFavorite: null,
      newestFavorite: null, topArtist: null
    };
  }
}

/**
 * Rechercher dans les favoris
 */
export async function searchFavorites(query: string): Promise<FavoriteTrack[]> {
  try {
    const favorites = await getUserFavorites();
    const lowerQuery = query.toLowerCase();

    return favorites.filter(f =>
      (f.track_title?.toLowerCase().includes(lowerQuery)) ||
      (f.track_artist?.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    logger.error('Failed to search favorites', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Supprimer plusieurs favoris
 */
export async function removeFavorites(trackIds: string[]): Promise<{ success: boolean; removedCount: number }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, removedCount: 0 };

    const { error } = await supabase
      .from('music_favorites')
      .delete()
      .eq('user_id', user.id)
      .in('track_id', trackIds);

    if (error) throw error;

    logger.info('Multiple favorites removed', { count: trackIds.length }, 'MUSIC');
    return { success: true, removedCount: trackIds.length };
  } catch (error) {
    logger.error('Failed to remove multiple favorites', error as Error, 'MUSIC');
    return { success: false, removedCount: 0 };
  }
}
