
import { MusicPlaylist, MusicTrack } from '@/types';

/**
 * Convert raw playlist data to MusicPlaylist type
 */
export function playlistToMusicPlaylist(rawData: any): MusicPlaylist {
  return {
    id: rawData.id || '',
    name: rawData.name || '',
    title: rawData.title || rawData.name || '',
    description: rawData.description || '',
    coverUrl: rawData.coverUrl || rawData.cover_url || '',
    tracks: Array.isArray(rawData.tracks) 
      ? rawData.tracks.map((track: any) => trackToMusicTrack(track))
      : [],
    category: rawData.category || '',
  };
}

/**
 * Convert raw track data to MusicTrack type
 */
export function trackToMusicTrack(rawData: any): MusicTrack {
  return {
    id: rawData.id || '',
    title: rawData.title || '',
    artist: rawData.artist || '',
    duration: rawData.duration || 0,
    url: rawData.url || rawData.audio_url || rawData.audioUrl || '',
    cover: rawData.cover || rawData.coverUrl || rawData.cover_url || '',
    coverUrl: rawData.coverUrl || rawData.cover_url || rawData.cover || '',
    emotion: rawData.emotion || rawData.emotion_tag || '',
  };
}

/**
 * Convert MusicTrack to raw track format (for backward compatibility)
 */
export function musicTrackToTrack(track: MusicTrack): any {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    url: track.url,
    coverUrl: track.coverUrl || track.cover || '',
    emotion: track.emotion || '',
  };
}

/**
 * Convert MusicPlaylist to raw playlist format (for backward compatibility)
 */
export function musicPlaylistToPlaylist(playlist: MusicPlaylist): any {
  return {
    id: playlist.id,
    name: playlist.name,
    title: playlist.title || playlist.name,
    tracks: playlist.tracks.map(musicTrackToTrack),
    coverUrl: playlist.coverUrl,
    description: playlist.description,
    category: playlist.category || '',
    emotion: playlist.emotion || ''
  };
}
