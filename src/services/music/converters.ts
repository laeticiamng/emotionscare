
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
