
import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Helper function to get track title with fallback
 */
export const getTrackTitle = (track?: MusicTrack | null): string => {
  if (!track) return '';
  return track.title || track.name || 'Unknown Track';
};

/**
 * Helper function to get track artist with fallback
 */
export const getTrackArtist = (track?: MusicTrack | null): string => {
  if (!track) return '';
  return track.artist || 'Unknown Artist';
};

/**
 * Helper function to get track cover URL with fallback
 */
export const getTrackCover = (track?: MusicTrack | null): string => {
  if (!track) return '';
  return track.coverUrl || track.cover || '/images/covers/default-cover.jpg';
};

/**
 * Helper function to get track URL with fallback
 */
export const getTrackUrl = (track?: MusicTrack | null): string => {
  if (!track) return '';
  return track.url || track.audioUrl || '';
};

/**
 * Normalize track data from different sources to a consistent format
 */
export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: getTrackTitle(track),
    artist: getTrackArtist(track),
    url: getTrackUrl(track),
    cover: getTrackCover(track),
    coverUrl: getTrackCover(track),
    duration: track.duration || 0,
    // Include other optional properties if they exist
    ...(track.audioUrl && { audioUrl: track.audioUrl }),
    ...(track.emotion && { emotion: track.emotion }),
  };
};

/**
 * Create music parameters for emotion-based recommendations
 */
export const createMusicParams = (emotion: string, intensity: number = 0.5) => {
  return {
    emotion,
    intensity,
  };
};

/**
 * Convert track array to playlist
 */
export const convertToPlaylist = (tracks: MusicTrack[], name: string = 'Generated Playlist'): MusicPlaylist => {
  return {
    id: `playlist-${Date.now()}`,
    name,
    tracks,
  };
};

/**
 * Ensure value is an array
 */
export const ensureArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

export default {
  getTrackTitle,
  getTrackArtist,
  getTrackCover,
  getTrackUrl,
  normalizeTrack,
  createMusicParams,
  convertToPlaylist,
  ensureArray
};
