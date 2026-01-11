/**
 * Service de musique connecté au backend Supabase
 * Remplace les données sample par des vraies données
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { MusicTrack, MusicPlaylist } from '@/types/music';

export interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  duration: number;
  mood: string;
  genre: string;
  created_at: string;
  owner_id: string;
  status: string;
}

/**
 * Récupérer les pistes générées pour l'utilisateur
 */
export async function fetchUserTracks(userId: string): Promise<MusicTrack[]> {
  try {
    const { data, error } = await supabase
      .from('generated_music_tracks')
      .select('*')
      .eq('owner_id', userId)
      .eq('status', 'ready')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.warn('Error fetching user tracks', error, 'MUSIC');
      return [];
    }

    return (data || []).map((track: any) => ({
      id: track.id,
      title: track.title || 'Piste générée',
      artist: track.artist || 'EmotionsCare AI',
      duration: track.duration_seconds || 180,
      url: track.audio_url,
      audioUrl: track.audio_url,
      genre: track.style || 'Ambient',
      mood: track.mode === 'A' ? 'calm' : track.mode === 'B' ? 'energy' : 'focus',
      coverUrl: track.cover_url,
    }));
  } catch (error) {
    logger.error('Failed to fetch user tracks', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Récupérer les playlists de l'utilisateur
 */
export async function fetchUserPlaylists(userId: string): Promise<MusicPlaylist[]> {
  try {
    const { data, error } = await supabase
      .from('user_playlists')
      .select(`
        id,
        name,
        description,
        mood,
        created_at,
        playlist_tracks(
          track_id,
          position,
          generated_music_tracks(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('Error fetching user playlists', error, 'MUSIC');
      return [];
    }

    return (data || []).map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      mood: playlist.mood,
      tracks: (playlist.playlist_tracks || [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((pt: any) => {
          const track = pt.generated_music_tracks;
          return {
            id: track?.id || pt.track_id,
            title: track?.title || 'Piste',
            artist: track?.artist || 'EmotionsCare',
            duration: track?.duration_seconds || 180,
            url: track?.audio_url,
            audioUrl: track?.audio_url,
            genre: track?.style || 'Ambient',
            mood: track?.mode === 'A' ? 'calm' : 'focus',
          };
        }),
    }));
  } catch (error) {
    logger.error('Failed to fetch user playlists', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Récupérer les pistes publiques par mood
 */
export async function fetchPublicTracksByMood(mood: string): Promise<MusicTrack[]> {
  try {
    const modeMap: Record<string, string> = {
      calm: 'A',
      focus: 'AB',
      energy: 'B',
      joy: 'B',
    };
    
    const mode = modeMap[mood] || 'AB';

    const { data, error } = await supabase
      .from('generated_music_tracks')
      .select('*')
      .eq('status', 'ready')
      .eq('mode', mode)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      logger.warn('Error fetching public tracks', error, 'MUSIC');
      return [];
    }

    return (data || []).map((track: any) => ({
      id: track.id,
      title: track.title || 'Piste publique',
      artist: track.artist || 'EmotionsCare Community',
      duration: track.duration_seconds || 180,
      url: track.audio_url,
      audioUrl: track.audio_url,
      genre: track.style || 'Ambient',
      mood,
      coverUrl: track.cover_url,
    }));
  } catch (error) {
    logger.error('Failed to fetch public tracks', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Créer une playlist
 */
export async function createPlaylist(
  userId: string,
  name: string,
  description?: string,
  mood?: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('user_playlists')
      .insert({
        user_id: userId,
        name,
        description,
        mood,
      })
      .select('id')
      .single();

    if (error) {
      logger.error('Failed to create playlist', error, 'MUSIC');
      return null;
    }

    return data.id;
  } catch (error) {
    logger.error('Failed to create playlist', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Ajouter une piste à une playlist
 */
export async function addTrackToPlaylist(
  playlistId: string,
  trackId: string,
  position?: number
): Promise<boolean> {
  try {
    // Récupérer la position max actuelle si non spécifiée
    let insertPosition = position;
    if (insertPosition === undefined) {
      const { data: existing } = await supabase
        .from('playlist_tracks')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1);
      
      insertPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;
    }

    const { error } = await supabase
      .from('playlist_tracks')
      .insert({
        playlist_id: playlistId,
        track_id: trackId,
        position: insertPosition,
      });

    if (error) {
      logger.error('Failed to add track to playlist', error, 'MUSIC');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to add track to playlist', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Enregistrer l'écoute d'une piste
 */
export async function recordTrackPlay(
  userId: string,
  trackId: string,
  durationListened: number,
  mood?: string
): Promise<void> {
  try {
    await supabase.from('music_play_history').insert({
      user_id: userId,
      track_id: trackId,
      duration_listened: durationListened,
      mood_before: mood,
      played_at: new Date().toISOString(),
    });
  } catch (error) {
    logger.warn('Failed to record track play', error, 'MUSIC');
  }
}

/**
 * Récupérer l'historique d'écoute
 */
export async function fetchPlayHistory(
  userId: string,
  limit = 20
): Promise<{ trackId: string; playedAt: string; duration: number }[]> {
  try {
    const { data, error } = await supabase
      .from('music_play_history')
      .select('track_id, played_at, duration_listened')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.warn('Error fetching play history', error, 'MUSIC');
      return [];
    }

    return (data || []).map((h: any) => ({
      trackId: h.track_id,
      playedAt: h.played_at,
      duration: h.duration_listened,
    }));
  } catch (error) {
    logger.error('Failed to fetch play history', error as Error, 'MUSIC');
    return [];
  }
}
