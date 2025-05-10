
import { Track, Playlist } from './types';
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Convertir Track en MusicTrack
export function convertTrackToMusicTrack(track: Track): MusicTrack {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    url: track.url,
    duration: track.duration,
    coverUrl: track.coverUrl || track.cover,
    cover_url: track.coverUrl || track.cover,
    cover: track.cover,
    
    // Add properties for compatibility
    audioUrl: track.audioUrl,
    audio_url: track.audioUrl,
    emotion: track.emotion,
    emotion_tag: track.emotion,
    mood: track.emotion
  };
}

// Convertir MusicTrack en Track
export function convertMusicTrackToTrack(track: MusicTrack): Track {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    url: track.url || '',
    duration: track.duration,
    
    // Handle various field names for compatibility
    audioUrl: track.audioUrl || track.audio_url || track.url || '',
    cover: track.cover || track.coverUrl || track.cover_url || '',
    coverUrl: track.coverUrl || track.cover_url || track.cover || '',
    emotion: track.emotion || track.emotion_tag || track.mood || ''
  };
}

// Convertir MusicPlaylist en Playlist
export function convertMusicPlaylistToPlaylist(musicPlaylist: MusicPlaylist): Playlist {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name || musicPlaylist.title || '',
    emotion: musicPlaylist.emotion || musicPlaylist.mood || '',
    tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
  };
}

// Convertir Playlist en MusicPlaylist
export function convertPlaylistToMusicPlaylist(playlist: Playlist): MusicPlaylist {
  return {
    id: playlist.id,
    name: playlist.name,
    title: playlist.name, // S'assurer que title est défini
    emotion: playlist.emotion,
    mood: playlist.emotion, // For backward compatibility
    tracks: playlist.tracks.map(convertTrackToMusicTrack)
  };
}
