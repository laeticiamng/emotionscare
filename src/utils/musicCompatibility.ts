
import { MusicTrack } from '@/types/music';

export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || 'Titre inconnu';
};

export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || 'Artiste inconnu';
};

export const getTrackCover = (track: MusicTrack): string => {
  return track.cover || track.coverImage || '/images/default-album.jpg';
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const normalizeMusicTrack = (track: any): MusicTrack => {
  return {
    id: track.id || Math.random().toString(36).substr(2, 9),
    title: track.title || track.name || 'Titre inconnu',
    artist: track.artist || track.author || 'Artiste inconnu',
    album: track.album,
    duration: track.duration || 0,
    url: track.url || track.src || '',
    cover: track.cover || track.coverImage || track.image,
    genre: track.genre,
    mood: track.mood
  };
};
