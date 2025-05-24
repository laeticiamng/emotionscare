
import { AudioTrack } from '@/types/audio';

export const getTrackTitle = (track: AudioTrack | any): string => {
  return track?.title || track?.name || 'Sans titre';
};

export const getTrackArtist = (track: AudioTrack | any): string => {
  return track?.artist || track?.author || 'Artiste inconnu';
};

export const getTrackDuration = (track: AudioTrack | any): number => {
  return track?.duration || 0;
};

export const getTrackUrl = (track: AudioTrack | any): string => {
  return track?.url || track?.audioUrl || '';
};

export const getTrackCover = (track: AudioTrack | any): string | undefined => {
  return track?.coverUrl || track?.cover_url || track?.artworkUrl;
};

export const normalizeTrack = (track: any): AudioTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: getTrackTitle(track),
    artist: getTrackArtist(track),
    duration: getTrackDuration(track),
    url: getTrackUrl(track),
    coverUrl: getTrackCover(track)
  };
};

export const ensureArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};
