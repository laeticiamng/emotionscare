
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { Track, Playlist } from './types';

/**
 * Convertit un objet MusicTrack en Track
 * Cette fonction est nécessaire car les deux interfaces sont légèrement différentes
 */
export const convertMusicTrackToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    url: musicTrack.url || musicTrack.audioUrl || '',
    cover: musicTrack.coverUrl || musicTrack.cover || '',
    duration: musicTrack.duration || 0,
  };
};

/**
 * Convertit un objet Track en MusicTrack
 */
export const convertTrackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    audioUrl: track.url,
    url: track.url,
    coverUrl: track.cover || '',
    cover: track.cover,
    duration: track.duration,
  };
};

/**
 * Convertit un objet MusicPlaylist en Playlist
 */
export const convertMusicPlaylistToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name,
    emotion: musicPlaylist.emotion,
    tracks: musicPlaylist.tracks.map(track => convertMusicTrackToTrack(track)),
  };
};

/**
 * Convertit un objet Playlist en MusicPlaylist
 */
export const convertPlaylistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id,
    name: playlist.name,
    emotion: playlist.emotion || 'neutral',
    tracks: playlist.tracks.map(track => convertTrackToMusicTrack(track)),
  };
};
