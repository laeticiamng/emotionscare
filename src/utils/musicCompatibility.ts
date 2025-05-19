
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || 'Sans titre';
};

export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || 'Artiste inconnu';
};

export const getTrackCover = (track: MusicTrack): string => {
  return track.cover || '/images/music/default-cover.jpg';
};

export const getTrackUrl = (track: MusicTrack): string => {
  return track.url || '';
};

export const getPlaylistTitle = (playlist: MusicPlaylist): string => {
  return playlist.title || 'Playlist sans titre';
};

export const getPlaylistCover = (playlist: MusicPlaylist): string => {
  return playlist.cover || 
         (playlist.tracks[0]?.cover) || 
         '/images/music/default-playlist-cover.jpg';
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const formatMood = (mood: string | string[] | undefined): string => {
  if (!mood) return 'Ambiance non définie';
  if (typeof mood === 'string') return mood;
  return mood.join(', ');
};

export const getMoodColor = (mood: string): string => {
  const moodColorMap: Record<string, string> = {
    joy: 'bg-amber-500',
    happiness: 'bg-yellow-500',
    calm: 'bg-blue-500',
    peace: 'bg-blue-400',
    sadness: 'bg-indigo-500',
    melancholy: 'bg-purple-500',
    anger: 'bg-red-500',
    energy: 'bg-orange-500',
    focus: 'bg-emerald-500',
    sleep: 'bg-violet-900',
    default: 'bg-gray-500'
  };
  
  return moodColorMap[mood.toLowerCase()] || moodColorMap.default;
};
