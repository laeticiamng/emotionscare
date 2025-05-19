
import { MusicTrack, Track, MusicPlaylist, Playlist } from '@/types/music';

/**
 * Normalizes a track to ensure all required fields are present
 */
export const normalizeTrack = (track: Track | MusicTrack): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: track.title || track.name || 'Unknown Track',
    artist: track.artist || 'Unknown Artist',
    duration: track.duration || 0,
    url: track.url || track.audioUrl || track.src || track.track_url || '',
    cover: track.cover || track.coverUrl || track.coverImage || '',
    // Keep other properties
    ...(track.mood && { mood: Array.isArray(track.mood) ? track.mood : [track.mood] }),
    ...(track.genre && { genre: track.genre }),
    ...(track.album && { album: track.album }),
    ...(track.emotion && { emotion: track.emotion }),
    ...(track.tags && { tags: track.tags })
  };
};

/**
 * Ensure a playlist conforms to MusicPlaylist format
 */
export const ensurePlaylist = (playlist: Playlist | MusicPlaylist): MusicPlaylist => {
  // Normalize all tracks in the playlist
  const normalizedTracks = playlist.tracks.map(track => normalizeTrack(track));
  
  return {
    id: playlist.id || `playlist-${Date.now()}`,
    name: playlist.name || playlist.title || 'Untitled Playlist',
    description: 'playlist' in playlist && 'description' in playlist 
      ? (playlist as MusicPlaylist).description || '' 
      : 'Custom Playlist',
    tracks: normalizedTracks,
    title: playlist.title || playlist.name,
    // Optional fields with defaults
    emotion: playlist.emotion || 'neutral',
    coverImage: 'coverImage' in playlist 
      ? (playlist as MusicPlaylist).coverImage || '/images/covers/default.jpg'
      : '/images/covers/default.jpg',
    source: 'source' in playlist 
      ? (playlist as MusicPlaylist).source || 'custom'
      : 'custom',
    mood: 'mood' in playlist 
      ? Array.isArray((playlist as MusicPlaylist).mood) 
        ? (playlist as MusicPlaylist).mood 
        : [(playlist as MusicPlaylist).mood as string]
      : ['neutral']
  };
};

/**
 * Converts a Track to MusicTrack or MusicPlaylist to Playlist
 * This is useful when components expect different formats
 */
export const convertToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return ensurePlaylist(playlist);
};

export const convertToMusicTrack = (track: Track): MusicTrack => {
  return normalizeTrack(track);
};

/**
 * Helper function to get a track's title with fallbacks
 */
export const getTrackTitle = (track: MusicTrack | Track | null): string => {
  if (!track) return 'Unknown Track';
  return track.title || track.name || 'Unknown Track';
};

/**
 * Helper function to get a track's artist with fallback
 */
export const getTrackArtist = (track: MusicTrack | Track | null): string => {
  if (!track) return 'Unknown Artist';
  return track.artist || 'Unknown Artist';
};

/**
 * Helper function to get a track's cover image URL with fallbacks
 */
export const getTrackCover = (track: MusicTrack | Track | null): string => {
  if (!track) return '';
  return track.cover || track.coverUrl || track.coverImage || '';
};

/**
 * Helper function to get a track's audio URL with fallbacks
 */
export const getTrackUrl = (track: MusicTrack | Track | null): string => {
  if (!track) return '';
  return track.url || track.audioUrl || track.src || track.track_url || '';
};

/**
 * Helper function to get a playlist's name with fallback
 */
export const getPlaylistName = (playlist: MusicPlaylist | Playlist | null): string => {
  if (!playlist) return 'Unknown Playlist';
  return playlist.name || playlist.title || 'Unknown Playlist';
};

/**
 * Helper function to get a playlist's cover image URL with fallback
 */
export const getPlaylistCover = (playlist: MusicPlaylist | Playlist | null): string => {
  if (!playlist) return '';
  return playlist.coverImage || playlist.cover || playlist.coverUrl || '';
};
