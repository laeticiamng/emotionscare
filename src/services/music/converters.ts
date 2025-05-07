
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
    duration: musicTrack.duration,
    url: musicTrack.audioUrl, // Assurez-vous que cette propriété est correcte
    cover: musicTrack.coverUrl // Et celle-ci aussi
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
    duration: track.duration,
    audioUrl: track.url, // Assurez-vous que cette conversion est correcte
    coverUrl: track.cover || '',
    emotion: 'neutral' // Émotion par défaut
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
