
import { Track, MusicTrack } from '@/types/music';

export const getTrackTitle = (track: Track | MusicTrack): string => {
  return track.title || 'Titre inconnu';
};

export const getTrackArtist = (track: Track | MusicTrack): string => {
  return track.artist || 'Artiste inconnu';
};

export const getTrackCover = (track: Track | MusicTrack): string | undefined => {
  return track.artwork || undefined;
};

export const getTrackUrl = (track: Track | MusicTrack): string => {
  if ('audioUrl' in track && track.audioUrl) {
    return track.audioUrl;
  }
  return track.url;
};
