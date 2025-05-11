
import { Track, Playlist } from './types';
import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Convertit un objet Track du service en objet MusicTrack pour l'UI
 */
export const trackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    url: track.url || '',
    duration: track.duration || 0, // Ensure duration is always provided
    coverUrl: track.coverUrl || track.cover,
    emotion: track.emotion,
    // Inclure les autres propriétés pour compatibilité
    audioUrl: track.audioUrl || track.url,
    audio_url: track.audioUrl || track.url,
    cover_url: track.coverUrl || track.cover,
    cover: track.cover || track.coverUrl
  };
};

/**
 * Convertit un objet MusicTrack de l'UI en objet Track pour le service
 */
export const musicTrackToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    duration: musicTrack.duration,
    url: musicTrack.url,
    coverUrl: musicTrack.coverUrl || musicTrack.cover_url || musicTrack.cover,
    emotion: musicTrack.emotion
  };
};

/**
 * Convertit un objet Playlist du service en objet MusicPlaylist pour l'UI
 */
export const playlistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id,
    name: playlist.name,
    title: playlist.name, // Utiliser name comme title pour la compatibilité
    description: playlist.name || 'Playlist personnalisée',
    coverUrl: (playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].coverUrl) || '/images/music/default-playlist.jpg',
    emotion: playlist.emotion,
    tracks: playlist.tracks.map(trackToMusicTrack)
  };
};

/**
 * Convertit un objet MusicPlaylist de l'UI en objet Playlist pour le service
 */
export const musicPlaylistToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name || musicPlaylist.title || '',
    emotion: musicPlaylist.emotion,
    tracks: musicPlaylist.tracks.map(musicTrackToTrack)
  };
};

// Aliases for backward compatibility
export const convertTrackToMusicTrack = trackToMusicTrack;
export const convertMusicTrackToTrack = musicTrackToTrack; 
export const convertPlaylistToMusicPlaylist = playlistToMusicPlaylist;
export const convertMusicPlaylistToPlaylist = musicPlaylistToPlaylist;
