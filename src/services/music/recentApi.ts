/**
 * Service de gestion de la reprise musicale
 * Interface avec la table music_recent via Supabase
 */

import { supabase } from '@/integrations/supabase/client';

export interface RecentTrack {
  track_id: string;
  position_sec: number;
  meta: {
    title?: string;
    artist?: string;
    cover?: string;
    duration_sec?: number;
    genre?: string;
  };
  updated_at: string;
}

/**
 * Récupère la dernière piste écoutée par l'utilisateur
 */
export async function getRecent(): Promise<RecentTrack | null> {
  try {
    const { data, error } = await supabase
      .from('music_recent')
      .select('track_id, position_sec, meta, updated_at')
      .single();
    
    if (error) {
      // Si aucun enregistrement trouvé, c'est normal
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erreur lors de la récupération de la piste récente:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API récent:', error);
    return null;
  }
}

/**
 * Sauvegarde la position actuelle d'écoute d'une piste
 */
export async function saveRecent(
  trackId: string, 
  positionSec: number, 
  meta?: {
    title?: string;
    artist?: string;
    cover?: string;
    duration_sec?: number;
    genre?: string;
  }
): Promise<void> {
  try {
    // Éviter de sauvegarder des positions très courtes (< 5s) ou en fin de piste
    if (positionSec < 5) {
      return;
    }
    
    // Si on a les métadonnées, éviter de sauvegarder si on est à plus de 95% de la piste
    if (meta?.duration_sec && positionSec > meta.duration_sec * 0.95) {
      return;
    }
    
    const { error } = await supabase
      .from('music_recent')
      .upsert({
        track_id: trackId,
        position_sec: Math.floor(positionSec),
        meta: meta || {},
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Erreur lors de la sauvegarde de la position:', error);
      throw error;
    }
    
    console.log(`Position sauvegardée: ${trackId} à ${positionSec}s`);
  } catch (error) {
    console.error('Erreur API sauvegarde position:', error);
    // Ne pas faire échouer l'expérience utilisateur pour un problème de sauvegarde
  }
}

/**
 * Supprime l'enregistrement de reprise (utilisateur a fini d'écouter)
 */
export async function clearRecent(): Promise<void> {
  try {
    const { error } = await supabase
      .from('music_recent')
      .delete();
    
    if (error) {
      console.error('Erreur lors de la suppression de la piste récente:', error);
      throw error;
    }
    
    console.log('Historique récent supprimé');
  } catch (error) {
    console.error('Erreur API suppression récent:', error);
    throw new Error('Impossible de supprimer l\'historique');
  }
}

/**
 * Met à jour uniquement la position d'une piste récente existante
 */
export async function updateRecentPosition(trackId: string, positionSec: number): Promise<void> {
  try {
    // Vérifier que la piste est déjà dans recent
    const recent = await getRecent();
    if (!recent || recent.track_id !== trackId) {
      console.log('Piste non trouvée dans recent, ignoré');
      return;
    }
    
    await saveRecent(trackId, positionSec, recent.meta);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de position:', error);
    // Ne pas faire échouer l'expérience pour ce problème
  }
}

/**
 * Calcule le pourcentage d'écoute d'une piste récente
 */
export function getListeningProgress(recent: RecentTrack): number {
  if (!recent.meta.duration_sec || recent.meta.duration_sec <= 0) {
    return 0;
  }
  
  return Math.min(100, (recent.position_sec / recent.meta.duration_sec) * 100);
}

/**
 * Détermine si une piste récente mérite d'être proposée à la reprise
 */
export function shouldSuggestResume(recent: RecentTrack): boolean {
  const progress = getListeningProgress(recent);
  
  // Proposer la reprise si l'utilisateur a écouté entre 10% et 90% de la piste
  return progress >= 10 && progress <= 90;
}