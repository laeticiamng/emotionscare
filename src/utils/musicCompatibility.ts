
import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Gets the cover URL from a track using any of the available property names
 */
export function getTrackCover(track: MusicTrack | null | undefined): string | undefined {
  if (!track) return undefined;
  return track.coverUrl || track.cover || track.coverImage || track.cover_url;
}

/**
 * Gets the audio URL from a track using any of the available property names
 */
export function getTrackAudioUrl(track: MusicTrack | null | undefined): string | undefined {
  if (!track) return undefined;
  return track.audioUrl || track.src || track.url || track.track_url;
}

/**
 * Gets the title or name from a track
 */
export function getTrackTitle(track: MusicTrack | null | undefined): string {
  if (!track) return 'Unknown Track';
  return track.title || track.name || 'Unknown Track';
}

/**
 * Gets the artist from a track
 */
export function getTrackArtist(track: MusicTrack | null | undefined): string {
  if (!track) return 'Unknown Artist';
  return track.artist || 'Unknown Artist';
}

/**
 * Gets the cover URL from a playlist using any of the available property names
 */
export function getPlaylistCover(playlist: MusicPlaylist | null | undefined): string | undefined {
  if (!playlist) return undefined;
  return playlist.coverUrl || playlist.cover || playlist.coverImage;
}

/**
 * Gets the title or name from a playlist
 */
export function getPlaylistTitle(playlist: MusicPlaylist | null | undefined): string {
  if (!playlist) return 'Unknown Playlist';
  return playlist.title || playlist.name || 'Unknown Playlist';
}

/**
 * Safely gets the emotion from a track
 */
export function getTrackEmotion(track: MusicTrack | null | undefined): string {
  if (!track) return '';
  return track.emotion || track.mood || '';
}
