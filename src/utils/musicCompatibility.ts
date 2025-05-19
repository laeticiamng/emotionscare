
import { MusicTrack, MusicPlaylist, Track, Playlist } from '@/types/music';
import { v4 as uuid } from 'uuid';

/**
 * Extraire la propriété cover d'une piste
 */
export const getTrackCover = (track: MusicTrack | Track): string => {
  return track.coverUrl || track.cover || track.coverImage || '';
};

/**
 * Extraire le titre d'une piste
 */
export const getTrackTitle = (track: MusicTrack | Track): string => {
  return track.title || track.name || 'Titre inconnu';
};

/**
 * Extraire l'artiste d'une piste
 */
export const getTrackArtist = (track: MusicTrack | Track): string => {
  return track.artist || 'Artiste inconnu';
};

/**
 * Extraire l'URL audio d'une piste
 */
export const getTrackUrl = (track: MusicTrack | Track): string => {
  return track.url || track.audioUrl || track.src || track.track_url || '';
};

/**
 * Convertir un objet quelconque en MusicTrack valide
 */
export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || uuid(),
    title: track.title || track.name || 'Sans titre',
    name: track.name || track.title,
    artist: track.artist || 'Artiste inconnu',
    duration: track.duration || 0,
    url: getTrackUrl(track),
    audioUrl: track.audioUrl || track.url || track.src,
    cover: track.cover || track.coverUrl || '',
    coverUrl: track.coverUrl || track.cover || '',
    coverImage: track.coverImage || track.coverUrl || track.cover || '',
    emotion: track.emotion || '',
    mood: Array.isArray(track.mood) ? track.mood : track.mood ? [track.mood] : [],
    genre: track.genre || '',
    album: track.album || '',
    tags: track.tags || []
  };
};

/**
 * Convertir un array en playlist
 */
export const ensurePlaylist = (data: any): MusicPlaylist => {
  if (Array.isArray(data)) {
    // Si c'est un array de pistes, créer une playlist
    return {
      id: `playlist-${Date.now()}`,
      name: 'Playlist générée',
      title: 'Playlist générée',
      tracks: data.map(normalizeTrack)
    };
  } else if (data && data.tracks) {
    // Si c'est un objet avec un tableau de pistes, normaliser les pistes
    return {
      ...data,
      id: data.id || `playlist-${Date.now()}`,
      name: data.name || data.title || 'Playlist',
      title: data.title || data.name || 'Playlist',
      tracks: Array.isArray(data.tracks) ? data.tracks.map(normalizeTrack) : []
    };
  } else {
    // Créer une playlist vide par défaut
    return {
      id: `playlist-${Date.now()}`,
      name: 'Playlist vide',
      title: 'Playlist vide',
      tracks: []
    };
  }
};
