
/**
 * Utility functions to ensure compatibility between different music type formats.
 * These functions help bridge the gap between Track/MusicTrack and Playlist/MusicPlaylist.
 */

import { Track, Playlist } from '@/services/music/types';
import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Gets the cover URL from a track, handling different property naming
 */
export const getTrackCover = (track: MusicTrack | Track): string | undefined => {
  return track.coverUrl || track.cover || track.coverImage || track.image_url || track.image || '';
};

/**
 * Gets the audio URL from a track, handling different property naming
 */
export const getTrackAudioUrl = (track: MusicTrack | Track): string => {
  return track.audioUrl || track.url || track.audio_url || track.track_url || track.src || '';
};

/**
 * Gets the track title, handling different property naming
 */
export const getTrackTitle = (track: MusicTrack | Track): string => {
  return track.title || track.name || 'Unknown Track';
};

/**
 * Gets the track artist, handling different property naming
 */
export const getTrackArtist = (track: MusicTrack | Track): string => {
  return track.artist || 'Unknown Artist';
};

/**
 * Converts a Track to a MusicTrack
 */
export const trackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration || 0,
    audioUrl: getTrackAudioUrl(track),
    coverUrl: getTrackCover(track),
    url: track.url
  };
};

/**
 * Converts a MusicTrack to a Track
 */
export const musicTrackToTrack = (track: MusicTrack): Track => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration || 0,
    url: getTrackAudioUrl(track),
    cover: getTrackCover(track),
  };
};

/**
 * Converts a Playlist to a MusicPlaylist
 */
export const playlistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id,
    name: playlist.name || playlist.title || 'Unknown Playlist',
    title: playlist.title || playlist.name,
    tracks: playlist.tracks.map(track => trackToMusicTrack(track))
  };
};

/**
 * Converts a MusicPlaylist to a Playlist
 */
export const musicPlaylistToPlaylist = (playlist: MusicPlaylist): Playlist => {
  return {
    id: playlist.id,
    name: playlist.name,
    title: playlist.title,
    tracks: playlist.tracks.map(track => musicTrackToTrack(track))
  };
};

/**
 * Ensures that whatever we get is properly formatted as a MusicPlaylist
 */
export const ensurePlaylist = (playlist: MusicPlaylist | Playlist | MusicTrack[]): MusicPlaylist => {
  // If it's already a MusicPlaylist
  if (playlist && 'tracks' in playlist) {
    return {
      id: playlist.id,
      name: playlist.name || playlist.title || 'Unknown Playlist',
      tracks: 'url' in playlist.tracks[0] 
        ? playlist.tracks.map(track => trackToMusicTrack(track as any))
        : playlist.tracks as MusicTrack[]
    };
  }
  
  // If it's an array of tracks
  if (Array.isArray(playlist)) {
    return {
      id: `playlist-${Date.now()}`,
      name: 'Generated Playlist',
      tracks: 'url' in playlist[0] && !('audioUrl' in playlist[0])
        ? playlist.map(track => trackToMusicTrack(track as any))
        : playlist as MusicTrack[]
    };
  }
  
  // Fallback to empty playlist
  return {
    id: `playlist-${Date.now()}`,
    name: 'Empty Playlist',
    tracks: []
  };
};

/**
 * Determines if a track is playable
 */
export const isTrackPlayable = (track: MusicTrack | Track): boolean => {
  return !!getTrackAudioUrl(track);
};
