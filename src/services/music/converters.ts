
import { MusicTrack } from '@/types/music';
import { Track } from './types';

/**
 * Convertit un objet MusicTrack en Track
 * Cette fonction est nécessaire car les deux interfaces sont légèrement différentes
 */
export const convertMusicTrackToTrack = (musicTrack: MusicTrack): Track => {
  return {
    id: musicTrack.id,
    title: musicTrack.title,
    artist: musicTrack.artist,
    url: musicTrack.audioUrl || '',
    cover: musicTrack.coverUrl || '',
    duration: musicTrack.duration || 0,
  };
};

/**
 * Convertit un objet Track en MusicTrack
 */
export const convertTrackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    audioUrl: track.url,
    coverUrl: track.cover,
    duration: track.duration,
  };
};
