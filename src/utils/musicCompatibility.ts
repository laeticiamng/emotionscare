
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
 * Find tracks based on mood
 */
export function findTracksByMood(tracks: MusicTrack[], mood: string): MusicTrack[] {
  const normalizedMood = mood.toLowerCase();
  return tracks.filter(track => 
    (track.mood?.toLowerCase() === normalizedMood) || 
    (track.emotion?.toLowerCase() === normalizedMood) ||
    (track.category?.toLowerCase() === normalizedMood) ||
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
