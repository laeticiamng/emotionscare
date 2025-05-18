
/**
 * Utilities to help with music type compatibility across different parts of the application
 */

import { MusicTrack, MusicPlaylist } from "@/types/music";

/**
 * Get the cover image URL from a track, handling different property names
 */
export const getTrackCover = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.coverUrl || track.cover || track.coverImage || '';
};

/**
 * Get the title from a track, handling different property names
 */
export const getTrackTitle = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.title || track.name || 'Unknown Track';
};

/**
 * Get the artist from a track, handling different property names
 */
export const getTrackArtist = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.artist || 'Unknown Artist';
};

/**
 * Get the audio URL from a track, handling different property names
 */
export const getTrackAudioUrl = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.audioUrl || track.url || track.src || track.track_url || '';
};

/**
 * Ensures that a value is a complete MusicTrack, filling in defaults for required fields
 */
export const ensureTrack = (track: Partial<MusicTrack>): MusicTrack => {
  return {
    id: track.id || `generated-${Date.now()}`,
    title: track.title || "Unknown Title",
    artist: track.artist || "Unknown Artist",
    duration: track.duration || 0,
    audioUrl: track.audioUrl || track.url || track.src || "",
    coverUrl: track.coverUrl || track.cover || track.coverImage || "",
    ...track
  };
};

/**
 * Ensures that an array of tracks or a partial playlist is converted to a complete MusicPlaylist
 */
export const ensurePlaylist = (input: MusicPlaylist | MusicTrack[] | any): MusicPlaylist => {
  if (Array.isArray(input)) {
    return {
      id: `playlist-${Date.now()}`,
      name: "Custom Playlist",
      tracks: input.map(ensureTrack),
    };
  } else if (input && typeof input === 'object') {
    return {
      id: input.id || `playlist-${Date.now()}`,
      name: input.name || input.title || "Untitled Playlist",
      tracks: Array.isArray(input.tracks) ? input.tracks.map(ensureTrack) : [],
      ...input
    };
  }
  
  // Default empty playlist
  return {
    id: `empty-${Date.now()}`,
    name: "Empty Playlist",
    tracks: []
  };
};

/**
 * Normalizes property names for compatibility with different API sources
 */
export const normalizeTrackProperties = (track: any): MusicTrack => {
  if (!track) return ensureTrack({});
  
  return ensureTrack({
    ...track,
    // Normalize URL fields
    audioUrl: track.audioUrl || track.url || track.src || track.track_url,
    // Normalize cover image fields
    coverUrl: track.coverUrl || track.cover || track.coverImage,
    // Normalize title
    title: track.title || track.name
  });
};

export default {
  getTrackCover,
  getTrackTitle,
  getTrackArtist,
  getTrackAudioUrl,
  ensureTrack,
  ensurePlaylist,
  normalizeTrackProperties
};
