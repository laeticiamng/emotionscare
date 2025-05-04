
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { Track, Playlist } from './types';

/**
 * Helper function to convert between MusicTrack and internal Track
 */
export const convertMusicTrackToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    duration: musicTrack.duration,
    url: musicTrack.audioUrl,
    cover: musicTrack.coverUrl,
  };
};

/**
 * Helper function to convert between internal Track and MusicTrack
 */
export const convertTrackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    audioUrl: track.url,
    coverUrl: track.cover || '',
  };
};

/**
 * Convert MusicPlaylist to internal Playlist format
 */
export const convertMusicPlaylistToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name,
    emotion: musicPlaylist.emotion,
    tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
  };
};

/**
 * Convert internal Playlist to MusicPlaylist format
 */
export const convertPlaylistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id,
    name: playlist.name,
    emotion: playlist.emotion || 'neutral',
    tracks: playlist.tracks.map(convertTrackToMusicTrack)
  };
};
