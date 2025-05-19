
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
 * Alias pour getTrackUrl
 */
export const getTrackAudioUrl = getTrackUrl;

/**
 * Convertir un MusicTrack en Track
 */
export const convertToTrack = (track: MusicTrack): Track => {
  return {
    id: track.id,
    title: getTrackTitle(track),
    artist: track.artist,
    duration: track.duration,
    url: getTrackUrl(track),
    cover: track.cover || track.coverUrl || track.coverImage || '',
    coverUrl: track.coverUrl || track.cover || track.coverImage || '',
    audioUrl: track.audioUrl || track.url || '',
    emotion: track.emotion || '',
    name: track.name || track.title
  };
};

/**
 * Convertir un Track en MusicTrack
 */
export const convertToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id || uuid(),
    title: getTrackTitle(track),
    name: track.name || track.title,
    artist: track.artist || 'Artiste inconnu',
    duration: track.duration || 0,
    url: getTrackUrl(track),
    audioUrl: track.audioUrl || track.url || '',
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
 * Convertir une MusicPlaylist en Playlist
 */
export const convertToPlaylist = (playlist: MusicPlaylist): Playlist => {
  return {
    id: playlist.id,
    name: playlist.name || playlist.title || 'Playlist',
    emotion: playlist.emotion,
    tracks: playlist.tracks.map(convertToTrack),
    title: playlist.title || playlist.name
  };
};

/**
 * Convertir une Playlist en MusicPlaylist
 */
export const convertToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id || `playlist-${Date.now()}`,
    name: playlist.name || playlist.title || 'Playlist',
    title: playlist.title || playlist.name || 'Playlist',
    emotion: playlist.emotion || '',
    tracks: playlist.tracks.map(convertToMusicTrack),
    description: '',
    source: 'user',
    coverImage: playlist.tracks[0]?.cover || '',
    mood: []
  };
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
      tracks: data.map(normalizeTrack),
      description: '',
      source: 'user',
      coverImage: '',
      mood: [],
      emotion: ''
    };
  } else if (data && data.tracks) {
    // Si c'est un objet avec un tableau de pistes, normaliser les pistes
    return {
      ...data,
      id: data.id || `playlist-${Date.now()}`,
      name: data.name || data.title || 'Playlist',
      title: data.title || data.name || 'Playlist',
      tracks: Array.isArray(data.tracks) ? data.tracks.map(normalizeTrack) : [],
      description: data.description || '',
      source: data.source || 'user',
      coverImage: data.coverImage || data.tracks?.[0]?.cover || '',
      mood: data.mood || [],
      emotion: data.emotion || ''
    };
  } else {
    // Créer une playlist vide par défaut
    return {
      id: `playlist-${Date.now()}`,
      name: 'Playlist vide',
      title: 'Playlist vide',
      tracks: [],
      description: '',
      source: 'user',
      coverImage: '',
      mood: [],
      emotion: ''
    };
  }
};
