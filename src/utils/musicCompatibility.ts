
/**
 * Utility functions for music track compatibility and display
 * across different music service formats
 */

import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Get the cover image URL for a track
 */
export const getTrackCover = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.coverUrl || track.artworkUrl || track.cover || '/images/default-cover.jpg';
};

/**
 * Get the title of a track
 */
export const getTrackTitle = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.title || track.name || 'Unknown Track';
};

/**
 * Get the artist of a track
 */
export const getTrackArtist = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.artist || track.artistName || 'Unknown Artist';
};

/**
 * Get the URL of a track
 */
export const getTrackUrl = (track: MusicTrack | null | undefined): string => {
  if (!track) return '';
  return track.url || track.audioUrl || track.streamUrl || '';
};

/**
 * Normalize a track to ensure consistent properties
 */
export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: track.title || track.name || 'Unknown Track',
    artist: track.artist || track.artistName || 'Unknown Artist',
    url: track.url || track.audioUrl || track.streamUrl || '',
    coverUrl: track.coverUrl || track.artworkUrl || track.cover || '/images/default-cover.jpg',
    duration: track.duration || 0,
    mood: track.mood || track.emotion || '',
    tags: Array.isArray(track.tags) ? track.tags : [],
  };
};

/**
 * Find tracks by mood/emotion
 */
export const findTracksByMood = (tracks: MusicTrack[], mood: string): MusicTrack[] => {
  const normalizedMood = mood.toLowerCase();
  
  return tracks.filter(track => {
    const trackMood = (track.mood || '').toLowerCase();
    const trackTags = (track.tags || []).map(tag => tag.toLowerCase());
    
    return trackMood.includes(normalizedMood) || 
           trackTags.some(tag => tag.includes(normalizedMood));
  });
};

/**
 * Ensure a value is an array
 */
export const ensureArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
};
