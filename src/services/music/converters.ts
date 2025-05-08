
import { MusicTrack, MusicPlaylist } from '@/types';
import { Track, Playlist } from './types';

/**
 * Convertit un MusicTrack en Track pour la couche de service
 */
export const convertMusicTrackToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    duration: musicTrack.duration || 0,
    url: musicTrack.url,
    cover: musicTrack.cover || musicTrack.coverUrl,
    coverUrl: musicTrack.coverUrl || musicTrack.cover,
    audioUrl: musicTrack.audioUrl || musicTrack.url,
    emotion: musicTrack.emotion, // Now included in MusicTrack type
  };
};

/**
 * Convertit un Track en MusicTrack pour la couche d'application
 */
export const convertTrackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    url: track.url,
    cover: track.cover,
    coverUrl: track.coverUrl,
    audioUrl: track.audioUrl,
    emotion: track.emotion, // Now included in MusicTrack type
  };
};

/**
 * Convertit un MusicPlaylist en Playlist pour la couche de service
 */
export const convertMusicPlaylistToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name,
    emotion: musicPlaylist.emotion || musicPlaylist.mood || 'neutral', // Now mood is included in MusicPlaylist
    tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
  };
};

/**
 * Convertit un Playlist en MusicPlaylist pour la couche d'application
 */
export const convertPlaylistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id,
    name: playlist.name,
    emotion: playlist.emotion,
    tracks: playlist.tracks.map(convertTrackToMusicTrack)
  };
};
