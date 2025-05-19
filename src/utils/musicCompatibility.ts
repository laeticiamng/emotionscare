
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

/**
 * Ensures a playlist object conforms to MusicPlaylist interface
 */
export function ensurePlaylist(playlist: any): MusicPlaylist {
  if (!playlist) {
    return {
      id: 'empty',
      title: 'Empty Playlist',
      tracks: []
    };
  }
  
  return {
    id: playlist.id || 'playlist-' + Date.now(),
    title: playlist.name || playlist.title || 'Untitled Playlist',
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(ensureTrack) : [],
    description: playlist.description || '',
  };
}

/**
 * Ensures a track object conforms to MusicTrack interface
 */
export function ensureTrack(track: any): MusicTrack {
  if (!track) {
    return {
      id: 'empty',
      title: 'Unknown Track',
      artist: 'Unknown Artist',
      duration: 0,
      url: '',
      audioUrl: ''
    };
  }
  
  return {
    id: track.id || 'track-' + Date.now(),
    title: track.title || track.name || 'Untitled Track',
    artist: track.artist || 'Unknown Artist',
    duration: track.duration || 0,
    url: track.url || track.audioUrl || '',
    audioUrl: track.audioUrl || track.url || '',
    coverUrl: track.coverUrl || track.cover_url || '',
    emotion: track.emotion || track.mood || '',
  };
}

/**
 * Convert from one playlist format to MusicPlaylist
 */
export function convertToPlaylist(data: any): MusicPlaylist {
  return ensurePlaylist(data);
}

/**
 * Create a music params object from emotion string or object
 */
export function createMusicParams(emotion: string | EmotionMusicParams): EmotionMusicParams {
  if (typeof emotion === 'string') {
    return { emotion };
  }
  return emotion;
}

/**
 * Gets track title with fallback
 */
export function getTrackTitle(track?: MusicTrack | null): string {
  if (!track) return 'Unknown Track';
  return track.title || 'Unknown Track';
}

/**
 * Gets track artist with fallback
 */
export function getTrackArtist(track?: MusicTrack | null): string {
  if (!track) return 'Unknown Artist';
  return track.artist || 'Unknown Artist';
}

/**
 * Gets track cover URL with fallback
 */
export function getTrackCover(track?: MusicTrack | null): string {
  if (!track) return '';
  return track.coverUrl || '';
}

/**
 * Gets track URL with fallback
 */
export function getTrackUrl(track?: MusicTrack | null): string {
  if (!track) return '';
  return track.url || track.audioUrl || '';
}

/**
 * Ensures array type
 */
export function ensureArray<T>(items: T | T[] | undefined | null): T[] {
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

/**
 * Normalize track data
 */
export function normalizeTrack(track: any): MusicTrack {
  return ensureTrack(track);
}

/**
 * Maps audioUrl to url if needed
 */
export function mapAudioUrlToUrl(track: any): MusicTrack {
  if (track.audioUrl && !track.url) {
    return { ...track, url: track.audioUrl };
  }
  if (track.url && !track.audioUrl) {
    return { ...track, audioUrl: track.url };
  }
  return track;
}

/**
 * Find tracks by mood
 */
export function findTracksByMood(tracks: MusicTrack[], mood: string): MusicTrack[] {
  if (!tracks || !Array.isArray(tracks)) return [];
  return tracks.filter(track => {
    const trackMood = (track.mood || track.emotion || '').toLowerCase();
    return trackMood.includes(mood.toLowerCase());
  });
}
