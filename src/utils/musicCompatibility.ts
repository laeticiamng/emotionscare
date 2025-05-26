
import { MusicTrack } from '@/types/music';

export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || 'Titre inconnu';
};

export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || 'Artiste inconnu';
};

export const getTrackCover = (track: MusicTrack): string | undefined => {
  return track.coverUrl;
};

export const getTrackDuration = (track: MusicTrack): number => {
  return track.duration || 0;
};
