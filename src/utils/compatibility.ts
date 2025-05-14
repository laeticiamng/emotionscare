
/**
 * Compatibility utilities to support both old and new property names
 * across component interfaces.
 */

import { MusicTrack, MusicPlaylist } from '@/types/music';
import { EmotionResult } from '@/types/emotion';
import { VRSessionTemplate } from '@/types/vr';

/**
 * Make sure a MusicTrack has both cover and coverUrl for backward compatibility
 */
export const normalizeTrack = (track: MusicTrack): MusicTrack => {
  if (!track) return track;
  
  return {
    ...track,
    cover: track.cover || track.coverUrl || track.cover_url,
    coverUrl: track.coverUrl || track.cover || track.cover_url,
    cover_url: track.cover_url || track.cover || track.coverUrl,
  };
};

/**
 * Make sure a playlist has both name and title for backward compatibility
 */
export const normalizePlaylist = (playlist: MusicPlaylist): MusicPlaylist => {
  if (!playlist) return playlist;
  
  return {
    ...playlist,
    name: playlist.name || playlist.title || '',
    title: playlist.title || playlist.name || '',
  };
};

/**
 * Make sure emotion result has all necessary properties
 */
export const normalizeEmotionResult = (result: EmotionResult): EmotionResult => {
  if (!result) return result;
  
  return {
    ...result,
    score: result.score || result.intensity || 50,
    intensity: result.intensity || result.score || 50,
    date: result.date || result.timestamp || new Date().toISOString(),
    timestamp: result.timestamp || result.date || new Date().toISOString(),
  };
};

/**
 * Make sure VR session template has all necessary properties
 */
export const normalizeVRSessionTemplate = (template: VRSessionTemplate): VRSessionTemplate => {
  if (!template) return template;
  
  return {
    ...template,
    title: template.title || template.name || '',
    name: template.name || template.title || '',
  };
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
