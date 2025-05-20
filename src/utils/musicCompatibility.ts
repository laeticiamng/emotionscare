
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

/**
 * Ensures the input is an array, converting single items to arrays if needed
 */
export const ensureArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
};

/**
 * Ensures a track has all required fields and standardizes property names
 */
export const ensureTrack = (track: Partial<MusicTrack>): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: track.title || track.name || 'Unknown Title',
    artist: track.artist || 'Unknown Artist',
    url: track.url || track.audioUrl || track.src || track.track_url || '',
    audioUrl: track.audioUrl || track.url || track.src || track.track_url || '',
    duration: track.duration || 0,
    coverUrl: track.coverUrl || track.cover || track.coverImage || '',
    // Include any other required fields with fallbacks
    emotion: track.emotion || undefined,
    mood: track.mood || undefined,
    intensity: track.intensity || undefined,
    tags: ensureArray(track.tags || []),
    category: track.category || [],
  } as MusicTrack;
};

/**
 * Ensures a playlist has all required fields and standardizes property names
 */
export const ensurePlaylist = (playlist: Partial<MusicPlaylist>): MusicPlaylist => {
  return {
    id: playlist.id || `playlist-${Date.now()}`,
    title: playlist.title || playlist.name || 'Untitled Playlist',
    description: playlist.description || '',
    coverUrl: playlist.coverUrl || playlist.cover || playlist.coverImage || '',
    tracks: (playlist.tracks || []).map(ensureTrack),
    emotion: playlist.emotion || undefined,
    mood: playlist.mood || undefined,
    category: playlist.category || [],
  } as MusicPlaylist;
};

/**
 * Create music params object from emotion string or object
 */
export const createMusicParams = (params: string | EmotionMusicParams): EmotionMusicParams => {
  if (typeof params === 'string') {
    return { emotion: params };
  }
  return params;
};

/**
 * Convert a track to a simple playlist
 */
export const convertToPlaylist = (track: MusicTrack): MusicPlaylist => {
  return {
    id: `playlist-from-track-${track.id}`,
    title: `${track.title} Playlist`,
    tracks: [track],
    emotion: track.emotion,
    mood: track.mood,
    category: track.category
  };
};

/**
 * Finds tracks by matching a mood
 */
export const findTracksByMood = (tracks: MusicTrack[], mood: string): MusicTrack[] => {
  return tracks.filter(track => 
    track.mood === mood || 
    track.emotion === mood ||
    (typeof track.category === 'string' && track.category === mood) ||
    (Array.isArray(track.category) && track.category.includes(mood))
  );
};

/**
 * Gets the title of a track with fallbacks
 */
export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || track.name || 'Unknown Track';
};

/**
 * Gets the artist of a track with fallbacks
 */
export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || 'Unknown Artist';
};

/**
 * Gets the cover image URL of a track with fallbacks
 */
export const getTrackCover = (track: MusicTrack): string => {
  return track.coverUrl || track.cover || track.coverImage || '';
};

/**
 * Gets the audio URL of a track with fallbacks
 */
export const getTrackUrl = (track: MusicTrack): string => {
  return track.audioUrl || track.url || track.src || track.track_url || '';
};

/**
 * Normalizes track data
 */
export const normalizeTrack = (track: any): MusicTrack => {
  if (!track) return track;
  
  return {
    ...track,
    id: track.id || `track-${Date.now()}`,
    title: getTrackTitle(track),
    artist: getTrackArtist(track),
    coverUrl: getTrackCover(track),
    audioUrl: getTrackUrl(track),
    url: getTrackUrl(track),
    duration: track.duration || 0,
  };
};

export default {
  ensureArray,
  ensureTrack,
  ensurePlaylist,
  findTracksByMood,
  getTrackTitle,
  getTrackArtist,
  getTrackCover,
  getTrackUrl,
  normalizeTrack,
  createMusicParams,
  convertToPlaylist
};
