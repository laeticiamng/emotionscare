
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour assurer qu'un élément est une playlist complète
export const ensurePlaylist = (input: MusicPlaylist | MusicTrack[]): MusicPlaylist => {
  if (Array.isArray(input)) {
    return {
      id: `playlist-${uuidv4()}`,
      name: 'Playlist générée',
      tracks: input
    };
  }
  return input;
};

// Fonction pour normaliser un morceau de musique
export const normalizeTrack = (track: Partial<MusicTrack>): MusicTrack => {
  return {
    id: track.id || uuidv4(),
    title: track.title || track.name || 'Sans titre',
    artist: track.artist || 'Artiste inconnu',
    duration: track.duration || 0,
    audioUrl: track.audioUrl || track.url || track.src || track.track_url || '',
    coverUrl: track.coverUrl || track.coverImage || track.cover || '',
    album: track.album || '',
    year: track.year || new Date().getFullYear(),
    genre: track.genre || '',
    tags: track.tags || []
  };
};

// Normaliser une playlist
export const normalizePlaylist = (playlist: Partial<MusicPlaylist>): MusicPlaylist => {
  return {
    id: playlist.id || uuidv4(),
    name: playlist.name || playlist.title || 'Sans titre',
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(normalizeTrack) : [],
    description: playlist.description || '',
    coverImage: playlist.coverImage || playlist.coverUrl || playlist.cover || '',
    emotion: playlist.emotion || playlist.mood || ''
  };
};

// Fonctions d'accès aux propriétés du track avec gestion des variations de nommage
export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || track.name || 'Sans titre';
};

export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || 'Artiste inconnu';
};

export const getTrackCover = (track: MusicTrack): string | undefined => {
  return track.coverUrl || track.coverImage || track.cover;
};

export const getTrackAudioUrl = (track: MusicTrack): string => {
  return track.audioUrl || track.url || track.src || track.track_url || '';
};
