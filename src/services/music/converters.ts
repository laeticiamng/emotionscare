
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { Track, Playlist } from './types';

/**
 * Convertit un MusicTrack en Track
 */
export function convertMusicTrackToTrack(musicTrack: MusicTrack): Track {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    duration: musicTrack.duration,
    url: musicTrack.audioUrl,
    cover: musicTrack.coverUrl
  };
}

/**
 * Convertit un Track en MusicTrack
 */
export function convertTrackToMusicTrack(track: Track): MusicTrack {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    audioUrl: track.url,
    coverUrl: track.cover || '',
    emotion: 'neutral' // Valeur par défaut
  };
}

/**
 * Convertit une MusicPlaylist en Playlist
 */
export function convertMusicPlaylistToPlaylist(musicPlaylist: MusicPlaylist): Playlist {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name,
    emotion: musicPlaylist.emotion,
    tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
  };
}

/**
 * Convertit une Playlist en MusicPlaylist
 */
export function convertPlaylistToMusicPlaylist(playlist: Playlist): MusicPlaylist {
  return {
    id: playlist.id,
    name: playlist.name,
    emotion: playlist.emotion || 'neutral',
    tracks: playlist.tracks.map(convertTrackToMusicTrack)
  };
}
