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

    const { data, error } = await supabase
      .rpc('get_user_favorites_count', { p_user_id: user.id });

    if (error) throw error;

    return data || 0;
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
