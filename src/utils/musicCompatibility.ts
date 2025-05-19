
import { MusicTrack, MusicPlaylist, Track, Playlist } from '@/types/music';

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
  return track.cover || track.coverUrl || track.coverImage || undefined;
};

/**
 * Récupère l'URL audio d'une piste de façon compatible entre différentes interfaces
 */
export const getTrackAudioUrl = (track: any): string => {
  if (!track) return '';
  return track.url || track.audioUrl || track.src || track.track_url || '';
};

/**
 * Convertit un objet de type Track en type MusicTrack
 */
export const convertToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title || track.name || '',
    name: track.name || track.title || '',
    artist: track.artist || '',
    duration: track.duration || 0,
    audioUrl: track.audioUrl || track.url || '',
    url: track.url || track.audioUrl || '',
    coverUrl: track.cover || undefined,
    cover: track.cover || undefined
  };
};

/**
 * Convertit un objet de type MusicTrack en type Track
 */
export const convertToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title || musicTrack.name || '',
    name: musicTrack.name || musicTrack.title || '',
    artist: musicTrack.artist || '',
    url: musicTrack.audioUrl || musicTrack.url || '',
    cover: musicTrack.coverUrl || musicTrack.cover,
    audioUrl: musicTrack.audioUrl || musicTrack.url || '',
    duration: musicTrack.duration || 0
  };
};

/**
 * Convertit un objet de type MusicPlaylist en type Playlist
 */
export const convertToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name || musicPlaylist.title || 'Untitled Playlist',
    title: musicPlaylist.title || musicPlaylist.name || 'Untitled Playlist',
    tracks: musicPlaylist.tracks.map(track => convertToTrack(track))
  };
};

/**
 * Convertit un objet de type Playlist en type MusicPlaylist
 */
export const convertToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id,
    name: playlist.name || playlist.title || 'Untitled Playlist',
    title: playlist.title || playlist.name || 'Untitled Playlist',
    tracks: playlist.tracks.map(track => convertToMusicTrack(track)),
    description: ''
  };
};

/**
 * S'assure qu'un objet est bien de type Playlist
 */
export const ensurePlaylist = (playlist: any): Playlist => {
  if (!playlist) {
    return { id: 'empty', name: 'Empty Playlist', tracks: [] };
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
    return { id: 'empty', url: '', name: 'Unknown Track' };
  }
  
  return {
    id: track.id || 'unknown',
    title: track.title || track.name || 'Unknown Track',
    name: track.name || track.title || 'Unknown Track',
    artist: track.artist || 'Unknown Artist',
    url: track.url || track.audioUrl || '',
    audioUrl: track.audioUrl || track.url || '',
    cover: track.cover || track.coverUrl || track.coverImage,
    duration: track.duration || 0
  };
};
