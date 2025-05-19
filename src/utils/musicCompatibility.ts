
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from "@/types/music";

/**
 * Récupère l'URL de la couverture de l'album à partir de différents champs possibles
 */
export const getTrackCover = (track: MusicTrack): string | undefined => {
  return track.cover || track.coverUrl || track.coverImage;
};

/**
 * Récupère le titre de la piste à partir de différents champs possibles
 */
export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || track.name || '';
};

/**
 * Récupère le nom de l'artiste à partir de différents champs possibles
 */
export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || '';
};

/**
 * Récupère l'URL audio de la piste à partir de différents champs possibles
 */
export const getTrackAudioUrl = (track: MusicTrack): string | undefined => {
  return track.url || track.audioUrl || track.src || track.track_url;
};

/**
 * Convertit un objet en MusicTrack
 */
export const normalizeTrack = (track: any): MusicTrack => {
  if (!track) return null;
  
  return {
    id: track.id || `track-${Date.now()}`,
    title: track.title || track.name || 'Unknown Track',
    artist: track.artist || 'Unknown Artist',
    url: track.url || track.audioUrl || track.src || track.track_url || '',
    duration: track.duration || 0,
    cover: track.cover || track.coverUrl || track.coverImage,
    coverUrl: track.coverUrl || track.cover || track.coverImage,
    coverImage: track.coverImage || track.coverUrl || track.cover,
    emotion: track.emotion || track.mood,
    mood: track.mood || track.emotion,
    genre: track.genre || '',
    album: track.album || '',
    ...(track.tags && { tags: track.tags }),
  };
};

/**
 * S'assure qu'une playlist est bien formatée
 */
export const ensurePlaylist = (playlist: any): MusicPlaylist => {
  if (!playlist) return null;
  
  // Ensure tracks are properly formatted
  const tracks = (playlist.tracks || []).map(track => normalizeTrack(track));
  
  return {
    id: playlist.id || `playlist-${Date.now()}`,
    title: playlist.title || playlist.name || 'Playlist sans titre',
    description: playlist.description || '',
    tracks: tracks,
    cover: playlist.cover || playlist.coverUrl || playlist.coverImage,
    coverUrl: playlist.coverUrl || playlist.cover || playlist.coverImage,
    coverImage: playlist.coverImage || playlist.coverUrl || playlist.cover,
    emotion: playlist.emotion || '',
    mood: ensureArray(playlist.mood || []),
    tags: ensureArray(playlist.tags || []),
    ...(playlist.category && { category: playlist.category }),
  };
};

/**
 * Convertit une playlist en MusicPlaylist
 */
export const convertToMusicPlaylist = (playlist: any): MusicPlaylist => {
  return ensurePlaylist(playlist);
};

/**
 * S'assure qu'une valeur est un tableau
 */
export const ensureArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

/**
 * Mappe un champ audioUrl vers url pour compatibilité
 */
export const mapAudioUrlToUrl = (track: MusicTrack): MusicTrack => {
  if (!track) return track;
  
  return {
    ...track,
    url: track.url || track.audioUrl || track.src || track.track_url || '',
  };
};

/**
 * Récupère l'URL de la piste
 */
export const getTrackUrl = (track: MusicTrack): string => {
  return track.url || track.audioUrl || track.src || track.track_url || '';
};

/**
 * Interface pour les paramètres de musique liés aux émotions
 */
export interface EmotionMusicParams {
  emotion?: string;
  mood?: string;
  intensity?: number;
  genre?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  duration?: number;
}

/**
 * Format du temps pour l'affichage (MM:SS)
 */
export const formatTime = (time: number): string => {
  if (isNaN(time)) return '00:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
