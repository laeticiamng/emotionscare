
import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Maps audioUrl to url if url doesn't exist
 * This ensures backward compatibility with different track structures
 */
export const mapAudioUrlToUrl = (track: MusicTrack): MusicTrack => {
  if (!track) return track;
  
  // If url doesn't exist but audioUrl does, use audioUrl as url
  if (!track.url && track.audioUrl) {
    return {
      ...track,
      url: track.audioUrl
    };
  }
  
  // If url doesn't exist but src does, use src as url
  if (!track.url && track.src) {
    return {
      ...track,
      url: track.src
    };
  }
  
  // If url doesn't exist but track_url does, use track_url as url
  if (!track.url && track.track_url) {
    return {
      ...track,
      url: track.track_url
    };
  }
  
  // If no url exists at all, create a placeholder
  if (!track.url) {
    return {
      ...track,
      url: `/audio/${track.id}.mp3` // Default placeholder URL
    };
  }
  
  return track;
};

/**
 * Processes a playlist to ensure all tracks have proper URL fields
 */
export const processPlaylistTracks = (playlist: MusicPlaylist): MusicPlaylist => {
  if (!playlist || !playlist.tracks) return playlist;
  
  return {
    ...playlist,
    tracks: playlist.tracks.map(mapAudioUrlToUrl)
  };
};

/**
 * Helper function to check if a category matches
 */
export const categoryMatches = (category: string | string[] | undefined, targetCategory: string): boolean => {
  if (!category) return false;
  
  if (Array.isArray(category)) {
    return category.some(cat => cat.toLowerCase() === targetCategory.toLowerCase());
  }
  
  return category.toLowerCase() === targetCategory.toLowerCase();
};

/**
 * Gets the track cover image URL from any track object format
 */
export const getTrackCover = (track?: MusicTrack | null): string | undefined => {
  if (!track) return undefined;
  return track.cover || track.coverUrl || track.coverImage || '/images/music/default-cover.jpg';
};

/**
 * Gets the track title from any track object format
 */
export const getTrackTitle = (track?: MusicTrack | null): string => {
  if (!track) return 'Unknown Track';
  return track.title || track.name || 'Untitled Track';
};

/**
 * Gets the track artist from any track object format
 */
export const getTrackArtist = (track?: MusicTrack | null): string => {
  if (!track) return 'Unknown Artist';
  return track.artist || 'Unknown Artist';
};

/**
 * Gets the track URL from any track object format
 */
export const getTrackUrl = (track?: MusicTrack | null): string | undefined => {
  if (!track) return undefined;
  return track.url || track.audioUrl || track.src || track.track_url;
};

/**
 * Normalizes a track to ensure it has all required fields
 */
export const normalizeTrack = (track: Partial<MusicTrack>): MusicTrack => {
  const id = track.id || `track-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id,
    title: getTrackTitle(track as MusicTrack),
    artist: getTrackArtist(track as MusicTrack),
    url: getTrackUrl(track as MusicTrack) || `/audio/${id}.mp3`,
    cover: getTrackCover(track as MusicTrack),
    ...track
  };
};

/**
 * Ensures a playlist is properly formatted
 */
export const ensurePlaylist = (playlist: MusicPlaylist | null): MusicPlaylist | null => {
  if (!playlist) return null;
  
  return {
    ...playlist,
    tracks: (playlist.tracks || []).map(normalizeTrack)
  };
};

/**
 * Converts any track list to a proper MusicPlaylist
 */
export const convertToMusicPlaylist = (
  tracks: MusicTrack[], 
  playlistInfo?: Partial<Omit<MusicPlaylist, 'tracks'>>
): MusicPlaylist => {
  const id = playlistInfo?.id || `playlist-${Date.now()}`;
  
  return {
    id,
    title: playlistInfo?.title || 'Custom Playlist',
    description: playlistInfo?.description || 'Generated playlist',
    cover: playlistInfo?.cover || tracks[0]?.cover || '/images/music/default-playlist.jpg',
    tracks: tracks.map(normalizeTrack),
    ...playlistInfo
  };
};

/**
 * Helper function to convert array-like mood/category to array
 */
export const ensureArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

