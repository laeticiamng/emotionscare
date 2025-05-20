
import { MusicTrack, AudioTrack } from '@/types/music';

// Helper functions to extract track information with compatibility across different track formats
export const getTrackTitle = (track: MusicTrack | AudioTrack): string => {
  return track.title || (track as any).name || 'Unknown Track';
};

export const getTrackArtist = (track: MusicTrack | AudioTrack): string => {
  return track.artist || (track as any).creator || 'Unknown Artist';
};

export const getTrackCover = (track: MusicTrack | AudioTrack): string => {
  return track.coverUrl || track.imageUrl || (track as any).cover || '/images/default-album-cover.jpg';
};

export const getTrackUrl = (track: MusicTrack | AudioTrack): string => {
  return track.url || track.audioUrl || '';
};

export const findTracksByMood = (tracks: MusicTrack[], mood: string): MusicTrack[] => {
  if (!tracks || !Array.isArray(tracks)) return [];
  
  return tracks.filter(track => {
    // Check various properties that might contain mood information
    const trackMood = track.mood?.toLowerCase() || '';
    const trackGenre = track.genre?.toLowerCase() || '';
    const trackTags = Array.isArray(track.tags) ? track.tags.map(tag => tag.toLowerCase()) : [];
    const trackMetadata = track.metadata || {};
    
    const moodLower = mood.toLowerCase();
    
    return trackMood.includes(moodLower) ||
           trackGenre.includes(moodLower) ||
           trackTags.some(tag => tag.includes(moodLower)) ||
           (trackMetadata.mood && trackMetadata.mood.toLowerCase().includes(moodLower));
  });
};

export const ensureArray = <T,>(value: T | T[] | undefined | null): T[] => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
};

export default {
  getTrackTitle,
  getTrackArtist,
  getTrackCover,
  getTrackUrl,
  findTracksByMood,
  ensureArray
};
