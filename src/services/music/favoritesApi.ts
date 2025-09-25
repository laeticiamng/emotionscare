/**
 * Service de gestion des favoris musicaux
 * Interface avec la table music_favorites via Supabase
 */

import { supabase } from '@/integrations/supabase/client';

export interface FavoriteTrack {
  track_id: string;
  meta: {
    title?: string;
    artist?: string;
    cover?: string;
    duration_sec?: number;
    genre?: string;
  };
  created_at: string;
}

/**
 * Récupère la liste des pistes favorites de l'utilisateur
 */
export async function listFavorites(): Promise<FavoriteTrack[]> {
  try {
    const { data, error } = await supabase
      .from('music_favorites')
      .select('track_id, meta, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
    
    return data ?? [];
  } catch (error) {
    console.error('Erreur API favoris:', error);
    throw new Error('Impossible de récupérer les favoris');
  }
}

/**
 * Ajoute une piste aux favoris
 */
export async function addFavorite(track: {
  id: string;
  title?: string;
  artist?: string;
  cover?: string;
  duration_sec?: number;
  genre?: string;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('music_favorites')
      .insert({
        track_id: track.id,
        meta: {
          title: track.title,
          artist: track.artist,
          cover: track.cover,
          duration_sec: track.duration_sec,
          genre: track.genre
        }
      });
    
    if (error) {
      // Si c'est une violation d'unicité (déjà en favoris), l'ignorer
      if (error.code === '23505') {
        console.log('Piste déjà en favoris');
        return;
      }
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
    
    console.log('Piste ajoutée aux favoris:', track.id);
  } catch (error) {
    console.error('Erreur API ajout favori:', error);
    throw new Error('Impossible d\'ajouter aux favoris');
  }
}

/**
 * Retire une piste des favoris
 */
export async function removeFavorite(trackId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('music_favorites')
      .delete()
      .eq('track_id', trackId);
    
    if (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      throw error;
    }
    
    console.log('Piste retirée des favoris:', trackId);
  } catch (error) {
    console.error('Erreur API suppression favori:', error);
    throw new Error('Impossible de retirer des favoris');
  }
}

/**
 * Vérifie si une piste est dans les favoris
 */
export async function isFavorite(trackId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('music_favorites')
      .select('track_id')
      .eq('track_id', trackId)
      .single();
    
    if (error) {
      // Si pas trouvé, c'est normal
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error('Erreur lors de la vérification favori:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Erreur API vérification favori:', error);
    return false;
  }
}

/**
 * Bascule l'état favori d'une piste (ajouter/retirer)
 */
export async function toggleFavorite(track: {
  id: string;
  title?: string;
  artist?: string;
  cover?: string;
  duration_sec?: number;
  genre?: string;  
}): Promise<boolean> {
  try {
    const favorite = await isFavorite(track.id);
    
    if (favorite) {
      await removeFavorite(track.id);
      return false;
    } else {
      await addFavorite(track);
      return true;
    }
  } catch (error) {
    console.error('Erreur lors du toggle favori:', error);
    throw error;
  }
}