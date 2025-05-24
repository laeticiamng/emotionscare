
import { Track, MusicTrack, MusicPlaylist } from '@/types/music';

// Fonction pour s'assurer qu'on a un tableau
export const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

// Fonction pour obtenir l'URL de la couverture
export const getTrackCover = (track: Track | MusicTrack): string | undefined => {
  if ('artwork' in track) return track.artwork;
  if ('coverUrl' in track) return track.coverUrl;
  return undefined;
};

// Fonction pour obtenir le titre
export const getTrackTitle = (track: Track | MusicTrack): string => {
  return track.title || 'Sans titre';
};

// Fonction pour obtenir l'artiste
export const getTrackArtist = (track: Track | MusicTrack): string => {
  return track.artist || 'Artiste inconnu';
};

// Fonction pour obtenir l'URL audio
export const getTrackUrl = (track: Track | MusicTrack): string => {
  if ('audioUrl' in track && track.audioUrl) return track.audioUrl;
  return track.url || '';
};

// Fonction pour convertir vers une playlist
export const convertToPlaylist = (
  data: any,
  defaultName: string = 'Playlist'
): MusicPlaylist => {
  if (!data) {
    return {
      id: 'empty-playlist',
      name: defaultName,
      tracks: []
    };
  }

  // Si c'est déjà une playlist
  if (data.id && data.tracks) {
    return {
      id: data.id,
      name: data.name || data.title || defaultName,
      tracks: ensureArray(data.tracks),
      description: data.description,
      tags: data.tags,
      creator: data.creator
    };
  }

  // Si c'est un tableau de tracks
  if (Array.isArray(data)) {
    return {
      id: `playlist-${Date.now()}`,
      name: defaultName,
      tracks: data
    };
  }

  // Si c'est un objet avec des tracks
  if (data.tracks) {
    return {
      id: data.id || `playlist-${Date.now()}`,
      name: data.name || data.title || defaultName,
      tracks: ensureArray(data.tracks),
      description: data.description
    };
  }

  // Fallback
  return {
    id: 'fallback-playlist',
    name: defaultName,
    tracks: []
  };
};
