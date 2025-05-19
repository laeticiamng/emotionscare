
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Interface Track du contexte music.tsx
export interface Track {
  id: string;
  title?: string;
  name?: string;
  artist?: string;
  url: string;
  cover?: string;
  audioUrl?: string;
  duration?: number;
}

// Interface Playlist du contexte music.tsx
export interface Playlist {
  id: string;
  name?: string;
  title?: string;
  tracks: Track[];
}

/**
 * Récupère le titre d'une piste de façon compatible entre différentes interfaces
 */
export const getTrackTitle = (track: any): string => {
  if (!track) return 'Unknown Track';
  return track.title || track.name || 'Unknown Track';
};

/**
 * Récupère l'artiste d'une piste de façon compatible entre différentes interfaces
 */
export const getTrackArtist = (track: any): string => {
  if (!track) return 'Unknown Artist';
  return track.artist || 'Unknown Artist';
};

/**
 * Récupère l'URL de couverture d'une piste de façon compatible entre différentes interfaces
 */
export const getTrackCover = (track: any): string | undefined => {
  if (!track) return undefined;
  return track.cover || track.coverUrl || undefined;
};

/**
 * Récupère l'URL audio d'une piste de façon compatible entre différentes interfaces
 */
export const getTrackAudioUrl = (track: any): string => {
  if (!track) return '';
  return track.url || track.audioUrl || '';
};

/**
 * Convertit un objet de type MusicPlaylist en type Playlist
 */
export const convertToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name,
    title: musicPlaylist.name,
    tracks: musicPlaylist.tracks.map(track => ({
      id: track.id,
      title: track.title,
      name: track.title,
      artist: track.artist,
      url: track.audioUrl || '',
      cover: track.coverUrl,
      audioUrl: track.audioUrl || '',
      duration: track.duration || 0
    }))
  };
};

/**
 * Convertit un objet de type MusicTrack en type Track
 */
export const convertToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    name: musicTrack.title,
    artist: musicTrack.artist,
    url: musicTrack.audioUrl || '',
    cover: musicTrack.coverUrl,
    audioUrl: musicTrack.audioUrl || '',
    duration: musicTrack.duration || 0
  };
};

/**
 * S'assure qu'un objet est bien de type Playlist
 */
export const ensurePlaylist = (playlist: any): Playlist => {
  if (!playlist) {
    return { id: 'empty', tracks: [] };
  }
  
  // Si c'est un tableau, convertir en playlist
  if (Array.isArray(playlist)) {
    return {
      id: 'generated',
      name: 'Generated Playlist',
      title: 'Generated Playlist',
      tracks: playlist.map(track => ensureTrack(track))
    };
  }
  
  // Si c'est déjà une playlist, s'assurer que les tracks sont correctes
  return {
    id: playlist.id || 'unknown',
    name: playlist.name || playlist.title || 'Untitled Playlist',
    title: playlist.title || playlist.name || 'Untitled Playlist',
    tracks: Array.isArray(playlist.tracks) 
      ? playlist.tracks.map(track => ensureTrack(track)) 
      : []
  };
};

/**
 * S'assure qu'un objet est bien de type Track
 */
export const ensureTrack = (track: any): Track => {
  if (!track) {
    return { id: 'empty', url: '' };
  }
  
  return {
    id: track.id || 'unknown',
    title: track.title || track.name || 'Unknown Track',
    name: track.name || track.title || 'Unknown Track',
    artist: track.artist || 'Unknown Artist',
    url: track.url || track.audioUrl || '',
    audioUrl: track.audioUrl || track.url || '',
    cover: track.cover || track.coverUrl,
    duration: track.duration || 0
  };
};
