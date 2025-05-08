
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { Track, Playlist } from './types';

/**
 * Convert a MusicTrack to a Track
 */
export function convertMusicTrackToTrack(musicTrack: MusicTrack): Track {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    duration: musicTrack.duration, // Maintenant requis dans les deux types
    url: musicTrack.audioUrl || musicTrack.url || '', // Use audioUrl or fallback to url
    cover: musicTrack.coverUrl || musicTrack.cover || '' // Use coverUrl or fallback to cover
  };
}

/**
 * Convert a Track to a MusicTrack
 */
export function convertTrackToMusicTrack(track: Track): MusicTrack {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration, // Required in both types now
    audioUrl: track.url,
    coverUrl: track.cover || '',
    emotion: 'neutral', // Émotion par défaut
    url: track.url, // For compatibility
    cover: track.cover // For compatibility
  };
}

/**
 * Convert a MusicPlaylist to a Playlist
 */
export function convertMusicPlaylistToPlaylist(musicPlaylist: MusicPlaylist): Playlist {
  const tracks = musicPlaylist.tracks.map(convertMusicTrackToTrack);
  
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name,
    emotion: musicPlaylist.emotion,
    tracks: tracks
  };
}

/**
 * Convert a Playlist to a MusicPlaylist
 */
export function convertPlaylistToMusicPlaylist(playlist: Playlist): MusicPlaylist {
  const tracks = playlist.tracks.map(convertTrackToMusicTrack);
  
  return {
    id: playlist.id,
    name: playlist.name,
    emotion: playlist.emotion || 'neutral',
    tracks: tracks
  };
}
