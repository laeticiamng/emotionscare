// @ts-nocheck

import { Playlist } from './types';
import { playlistToMusicPlaylist } from './converters';
import { MusicPlaylist } from '@/types/music';
import { logger } from '@/lib/logger';

// Données mockées de playlists pour le développement
const mockPlaylists: Record<string, MusicPlaylist> = {
  'meditation': {
    id: 'meditation-playlist',
    name: 'Méditation profonde',
    description: 'Musique apaisante pour la méditation',
    coverUrl: '/images/meditation.jpg',
    emotion: 'calm',
    tracks: [
      {
        id: 'meditation-1',
        title: 'Inner Peace',
        artist: 'Zen Garden',
        duration: 360,
        url: 'https://example.com/meditation1.mp3',
        audioUrl: 'https://example.com/meditation1.mp3',
        coverUrl: '/images/meditation1.jpg'
      },
      {
        id: 'meditation-2',
        title: 'Mindful Morning',
        artist: 'Breath Collective',
        duration: 480,
        url: 'https://example.com/meditation2.mp3',
        audioUrl: 'https://example.com/meditation2.mp3',
        coverUrl: '/images/meditation2.jpg'
      }
    ]
  },
  'focus': {
    id: 'focus-playlist',
    name: 'Concentration maximale',
    description: 'Musique pour améliorer la concentration',
    coverUrl: '/images/focus.jpg',
    emotion: 'focused',
    tracks: [
      {
        id: 'focus-1',
        title: 'Deep Work',
        artist: 'Productivity Sound',
        duration: 300,
        url: 'https://example.com/focus1.mp3',
        audioUrl: 'https://example.com/focus1.mp3',
        coverUrl: '/images/focus1.jpg'
      },
      {
        id: 'focus-2',
        title: 'Flow State',
        artist: 'Mind Waves',
        duration: 320,
        url: 'https://example.com/focus2.mp3',
        audioUrl: 'https://example.com/focus2.mp3',
        coverUrl: '/images/focus2.jpg'
      }
    ]
  }
};

/**
 * Récupère une playlist par ID
 */
export const getPlaylist = async (id: string): Promise<Playlist | null> => {
  try {
    // Simuler une requête API
    logger.debug(`Récupération de la playlist: ${id}`, undefined, 'MUSIC');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Dans une implémentation réelle, on ferait un appel à l'API
    const mockPlaylist = mockPlaylists[id];
    
    if (mockPlaylist) {
      return {
        id: mockPlaylist.id,
        name: mockPlaylist.name,
        title: mockPlaylist.title,
        tracks: mockPlaylist.tracks.map(track => ({
          ...track,
          url: track.url || track.audioUrl || track.audio_url || ''
        }))
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Error fetching playlist', error as Error, 'MUSIC');
    return null;
  }
};

/**
 * Récupère toutes les playlists disponibles
 */
export const getAllPlaylists = async (): Promise<Playlist[]> => {
  try {
    // Simuler une requête API
    logger.debug('Récupération de toutes les playlists', undefined, 'MUSIC');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dans une implémentation réelle, on ferait un appel à l'API
    return Object.values(mockPlaylists).map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      title: playlist.title,
      tracks: playlist.tracks.map(track => ({
        ...track,
        url: track.url || track.audioUrl || track.audio_url || ''
      }))
    }));
  } catch (error) {
    logger.error('Error fetching all playlists', error as Error, 'MUSIC');
    return [];
  }
};

/**
 * Récupère les playlists recommandées basées sur l'émotion
 */
export const getRecommendedPlaylists = async (emotion: string): Promise<Playlist[]> => {
  try {
    // Simuler une requête API
    logger.debug(`Récupération des playlists recommandées pour l'émotion: ${emotion}`, undefined, 'MUSIC');
    await new Promise(resolve => setTimeout(resolve, 400));

    // Dans une implémentation réelle, on ferait un appel à l'API avec l'émotion comme paramètre
    return Object.values(mockPlaylists)
      .filter(playlist => playlist.emotion && playlist.emotion.includes(emotion.toLowerCase()))
      .map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        title: playlist.title,
        tracks: playlist.tracks.map(track => ({
          ...track,
          url: track.url || track.audioUrl || track.audio_url || ''
        }))
      }));
  } catch (error) {
    logger.error('Error fetching recommended playlists', error as Error, 'MUSIC');
    return [];
  }
};

// ========== MÉTHODES ENRICHIES ==========

import { supabase } from '@/integrations/supabase/client';

/**
 * Créer une nouvelle playlist
 */
export const createPlaylist = async (playlist: {
  name: string;
  description?: string;
  coverUrl?: string;
  emotion?: string;
  isPublic?: boolean;
}): Promise<Playlist | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('music_playlists')
      .insert({
        user_id: user.id,
        name: playlist.name,
        description: playlist.description,
        cover_url: playlist.coverUrl,
        emotion: playlist.emotion,
        is_public: playlist.isPublic || false,
        tracks: [],
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Playlist created', { playlistId: data.id }, 'MUSIC');
    return {
      id: data.id,
      name: data.name,
      title: data.name,
      tracks: []
    };
  } catch (error) {
    logger.error('Error creating playlist', error as Error, 'MUSIC');
    return null;
  }
};

/**
 * Mettre à jour une playlist
 */
export const updatePlaylist = async (
  playlistId: string,
  updates: {
    name?: string;
    description?: string;
    coverUrl?: string;
    emotion?: string;
    isPublic?: boolean;
  }
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('music_playlists')
      .update({
        name: updates.name,
        description: updates.description,
        cover_url: updates.coverUrl,
        emotion: updates.emotion,
        is_public: updates.isPublic,
        updated_at: new Date().toISOString()
      })
      .eq('id', playlistId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('Playlist updated', { playlistId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Error updating playlist', error as Error, 'MUSIC');
    return false;
  }
};

/**
 * Supprimer une playlist
 */
export const deletePlaylist = async (playlistId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('music_playlists')
      .delete()
      .eq('id', playlistId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('Playlist deleted', { playlistId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Error deleting playlist', error as Error, 'MUSIC');
    return false;
  }
};

/**
 * Ajouter un track à une playlist
 */
export const addTrackToPlaylist = async (
  playlistId: string,
  track: { id: string; title: string; artist: string; duration: number; url: string }
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Récupérer la playlist actuelle
    const { data: playlist } = await supabase
      .from('music_playlists')
      .select('tracks')
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .single();

    if (!playlist) return false;

    const currentTracks = playlist.tracks || [];
    const newTracks = [...currentTracks, track];

    const { error } = await supabase
      .from('music_playlists')
      .update({ tracks: newTracks, updated_at: new Date().toISOString() })
      .eq('id', playlistId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('Track added to playlist', { playlistId, trackId: track.id }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Error adding track to playlist', error as Error, 'MUSIC');
    return false;
  }
};

/**
 * Retirer un track d'une playlist
 */
export const removeTrackFromPlaylist = async (
  playlistId: string,
  trackId: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: playlist } = await supabase
      .from('music_playlists')
      .select('tracks')
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .single();

    if (!playlist) return false;

    const currentTracks = playlist.tracks || [];
    const newTracks = currentTracks.filter((t: any) => t.id !== trackId);

    const { error } = await supabase
      .from('music_playlists')
      .update({ tracks: newTracks, updated_at: new Date().toISOString() })
      .eq('id', playlistId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('Track removed from playlist', { playlistId, trackId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Error removing track from playlist', error as Error, 'MUSIC');
    return false;
  }
};

/**
 * Récupérer les playlists de l'utilisateur
 */
export const getUserPlaylists = async (): Promise<Playlist[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('music_playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      title: p.name,
      tracks: p.tracks || []
    }));
  } catch (error) {
    logger.error('Error fetching user playlists', error as Error, 'MUSIC');
    return [];
  }
};

/**
 * Dupliquer une playlist
 */
export const duplicatePlaylist = async (playlistId: string, newName?: string): Promise<Playlist | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: original } = await supabase
      .from('music_playlists')
      .select('*')
      .eq('id', playlistId)
      .single();

    if (!original) return null;

    const { data, error } = await supabase
      .from('music_playlists')
      .insert({
        user_id: user.id,
        name: newName || `${original.name} (copie)`,
        description: original.description,
        cover_url: original.cover_url,
        emotion: original.emotion,
        is_public: false,
        tracks: original.tracks || [],
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Playlist duplicated', { originalId: playlistId, newId: data.id }, 'MUSIC');
    return {
      id: data.id,
      name: data.name,
      title: data.name,
      tracks: data.tracks || []
    };
  } catch (error) {
    logger.error('Error duplicating playlist', error as Error, 'MUSIC');
    return null;
  }
};

/**
 * Obtenir les playlists publiques
 */
export const getPublicPlaylists = async (limit: number = 20): Promise<Playlist[]> => {
  try {
    const { data, error } = await supabase
      .from('music_playlists')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      title: p.name,
      tracks: p.tracks || []
    }));
  } catch (error) {
    logger.error('Error fetching public playlists', error as Error, 'MUSIC');
    return [];
  }
};

/**
 * Réordonner les tracks dans une playlist
 */
export const reorderPlaylistTracks = async (
  playlistId: string,
  trackIds: string[]
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: playlist } = await supabase
      .from('music_playlists')
      .select('tracks')
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .single();

    if (!playlist) return false;

    const currentTracks = playlist.tracks || [];
    const trackMap = new Map(currentTracks.map((t: any) => [t.id, t]));
    const reorderedTracks = trackIds.map(id => trackMap.get(id)).filter(Boolean);

    const { error } = await supabase
      .from('music_playlists')
      .update({ tracks: reorderedTracks, updated_at: new Date().toISOString() })
      .eq('id', playlistId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('Playlist tracks reordered', { playlistId }, 'MUSIC');
    return true;
  } catch (error) {
    logger.error('Error reordering playlist tracks', error as Error, 'MUSIC');
    return false;
  }
};
