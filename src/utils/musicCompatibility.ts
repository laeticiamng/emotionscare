
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
