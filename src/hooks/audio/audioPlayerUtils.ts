// @ts-nocheck

import { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

/**
 * Format seconds to mm:ss format
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

/**
 * Get audio URL from track object
 */
export const getTrackAudioUrl = (track: MusicTrack): string => {
  // Try different property names that might contain the URL
  return track.url || '';
};

/**
 * Handle play errors
 */
export const handlePlayError = (error: Error): string => {
  logger.error('Audio playback error', error, 'MUSIC');
  
  // Check for common error types
  if (error.name === 'NotAllowedError') {
    return 'Playback was blocked by the browser. User interaction may be required.';
  }
  
  if (error.name === 'NotSupportedError') {
    return 'The audio format is not supported by your browser.';
  }
  
  if (error.message.includes('network')) {
    return 'Network error while loading the audio file.';
  }
  
  return 'An error occurred during audio playback.';
};
