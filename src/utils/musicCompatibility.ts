
import { MusicTrack } from '@/types/music';

export const ensureArray = <T>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value];
};

export const validateMusicTrack = (track: any): track is MusicTrack => {
  return track && 
         typeof track.id === 'string' &&
         typeof track.title === 'string' &&
         typeof track.url === 'string' &&
         typeof track.duration === 'number';
};
