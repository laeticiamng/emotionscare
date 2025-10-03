
/**
 * Music Compatibility Utilities
 * 
 * This file contains utility functions to ensure compatibility between different
 * music data structures used across the application.
 */

import { MusicTrack, MusicPlaylist } from '@/types/music';

/**
 * Normalizes a track object to ensure all common field variants are populated.
 * This helps maintain compatibility with components that might use different field names.
 */
export function normalizeTrack(track: MusicTrack): MusicTrack {
  if (!track) return track;
  
  return {
    ...track,
    // Ensure URL fields are consistent
    url: track.url || track.audioUrl || track.src || track.track_url,
    audioUrl: track.audioUrl || track.url || track.src || track.track_url,
    src: track.src || track.audioUrl || track.url || track.track_url,
    track_url: track.track_url || track.audioUrl || track.url || track.src,
    
    // Ensure cover image fields are consistent
    coverUrl: track.coverUrl || track.cover || track.coverImage,
    cover: track.cover || track.coverUrl || track.coverImage,
    coverImage: track.coverImage || track.coverUrl || track.cover,
    
    // Ensure name is available (some components use name instead of title)
    name: track.name || track.title,
    title: track.title || track.name,
    
    // Ensure mood/emotion compatibility
    mood: track.mood || track.emotion,
    emotion: track.emotion || track.mood,
  };
}

/**
 * Normalizes a playlist object to ensure all common field variants are populated.
 */
export function normalizePlaylist(playlist: MusicPlaylist): MusicPlaylist {
  if (!playlist) return playlist;
  
  return {
    ...playlist,
    // Ensure tracks are normalized
    tracks: playlist.tracks?.map(normalizeTrack) || [],
    
    // Ensure title/name compatibility
    title: playlist.title || playlist.name,
    name: playlist.name || playlist.title,
    
    // Ensure cover image fields are consistent
    coverUrl: playlist.coverUrl || playlist.cover || playlist.coverImage,
    cover: playlist.cover || playlist.coverUrl || playlist.coverImage,
    coverImage: playlist.coverImage || playlist.coverUrl || playlist.cover,
    
    // Ensure mood/emotion compatibility
    mood: playlist.mood || playlist.emotion,
    emotion: playlist.emotion || playlist.mood,
  };
}

/**
 * Helps adapt music data from different sources into a consistent format
 */
export function adaptMusicData(data: any): MusicTrack | null {
  if (!data) return null;
  
  // Check if the data is already a valid music track
  if (data.id && (data.title || data.name) && (data.audioUrl || data.url || data.src)) {
    return normalizeTrack(data as MusicTrack);
  }
  
  // Try to adapt from different formats
  const track: MusicTrack = {
    id: data.id || data.trackId || `track-${Date.now()}`,
    title: data.title || data.name || data.trackName || 'Unknown Track',
    artist: data.artist || data.artistName || data.creator || 'Unknown Artist',
    duration: data.duration || 0,
    url: data.url || data.audioUrl || data.src || data.track_url || '',
    audioUrl: data.audioUrl || data.url || data.src || data.track_url || '',
  };
  
  // Add additional fields if available
  if (data.album) track.album = data.album;
  if (data.cover || data.coverUrl || data.coverImage) {
    track.coverUrl = data.coverUrl || data.cover || data.coverImage;
    track.cover = track.coverUrl;
    track.coverImage = track.coverUrl;
  }
  if (data.emotion || data.mood) {
    track.emotion = data.emotion || data.mood;
    track.mood = track.emotion;
  }
  
  return normalizeTrack(track);
}

export default {
  normalizeTrack,
  normalizePlaylist,
  adaptMusicData
};
