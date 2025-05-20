
import { MusicTrack } from '@/types/music';

/**
 * Ensure a value is always returned as an array
 */
export function ensureArray<T>(value: T | T[] | undefined | null): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return [];
  }
  return [value];
}

/**
 * Get the track cover URL with fallbacks
 */
export function getTrackCover(track: MusicTrack): string {
  return track.coverUrl || 
         track.artworkUrl || 
         track.cover || 
         '/images/music/default-cover.jpg';
}

/**
 * Get track title with fallback
 */
export function getTrackTitle(track: MusicTrack | undefined): string {
  if (!track) return 'Unknown';
  return track.title || 'Untitled Track';
}

/**
 * Get track artist with fallback
 */
export function getTrackArtist(track: MusicTrack | undefined): string {
  if (!track) return 'Unknown Artist';
  return track.artist || 'Unknown Artist';
}

/**
 * Get track URL with fallback
 */
export function getTrackUrl(track: MusicTrack | undefined): string {
  if (!track) return '';
  return track.url || track.audioUrl || '';
}

/**
 * Normalize track data to ensure consistent format
 */
export function normalizeTrack(data: any): MusicTrack {
  return {
    id: data.id || `track-${Date.now()}`,
    title: data.title || 'Untitled Track',
    artist: data.artist || 'Unknown Artist',
    url: data.url || data.audioUrl || '',
    duration: data.duration || 0,
    coverUrl: data.coverUrl || data.cover || data.artworkUrl || '/images/music/default-cover.jpg',
    audioUrl: data.audioUrl || data.url || '',
  };
}

/**
 * Find tracks based on mood
 */
export function findTracksByMood(tracks: MusicTrack[], mood: string): MusicTrack[] {
  const normalizedMood = mood.toLowerCase();
  return tracks.filter(track =>
    (track.mood?.toLowerCase() === normalizedMood) ||
    (track.emotion?.toLowerCase() === normalizedMood) ||
    (typeof track.category === 'string' && track.category.toLowerCase() === normalizedMood) ||
    (track.tags?.some(tag => tag.toLowerCase().includes(normalizedMood)))
  );
}

/**
 * Format track duration from seconds to mm:ss
 */
export function formatTrackDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds)) {
    return '0:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
