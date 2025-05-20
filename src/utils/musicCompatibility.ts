
import { MusicTrack, MusicPlaylist } from '@/types/music';

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
    audioUrl: track.audioUrl || track.url || track.src || track.track_url || '',
    duration: track.duration || 0,
    coverUrl: track.coverUrl || track.cover || track.coverImage || '',
    // Include any other required fields with fallbacks
    emotion: track.emotion || undefined,
    mood: track.mood || undefined,
    intensity: track.intensity || undefined,
    tags: ensureArray(track.tags || []),
    category: ensureArray(track.category || []),
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
    category: ensureArray(playlist.category || []),
  } as MusicPlaylist;
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
