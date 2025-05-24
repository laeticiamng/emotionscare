
import { MusicTrack } from '@/types/music';

/**
 * Utility functions for music track compatibility
 */

export const getTrackTitle = (track: MusicTrack | any): string => {
  return track?.title || track?.name || 'Sans titre';
};

export const getTrackArtist = (track: MusicTrack | any): string => {
  return track?.artist || track?.author || 'Artiste inconnu';
};

export const getTrackDuration = (track: MusicTrack | any): number => {
  return track?.duration || 0;
};

export const getTrackUrl = (track: MusicTrack | any): string => {
  return track?.url || track?.audioUrl || '';
};

export const getTrackCover = (track: MusicTrack | any): string | undefined => {
  return track?.cover_url || track?.coverUrl || track?.artworkUrl;
};

export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: getTrackTitle(track),
    artist: getTrackArtist(track),
    duration: getTrackDuration(track),
    url: getTrackUrl(track),
    cover_url: getTrackCover(track)
  };
};
