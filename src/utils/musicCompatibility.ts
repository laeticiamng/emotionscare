
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { mockTracks } from '@/contexts/music/mockMusicData';

// Map audioUrl to url for compatibility
export const mapAudioUrlToUrl = (track: MusicTrack): MusicTrack => {
  return {
    ...track,
    url: track.audioUrl || track.url // For backward compatibility
  };
};

// Find tracks by mood
export const findTracksByMood = (mood: string): MusicTrack[] => {
  return mockTracks.filter(track => 
    track.mood === mood || 
    track.emotion === mood || 
    (track.tags && (typeof track.tags === 'string' 
      ? track.tags.includes(mood) 
      : Array.isArray(track.tags) && track.tags.includes(mood)))
  );
};

// Get track title safely
export const getTrackTitle = (track: MusicTrack | null): string => {
  if (!track) return '';
  return track.title || track.name || 'Unknown Track';
};

// Get track artist safely
export const getTrackArtist = (track: MusicTrack | null): string => {
  if (!track) return '';
  return track.artist || 'Unknown Artist';
};

// Get track cover image safely
export const getTrackCover = (track: MusicTrack | null): string => {
  if (!track) return '';
  return track.coverUrl || track.cover || track.coverImage || '';
};

// Get track URL safely
export const getTrackUrl = (track: MusicTrack | null): string => {
  if (!track) return '';
  return track.url || track.audioUrl || '';
};

// Normalize track for compatibility
export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: track.title || track.name || 'Unknown Track',
    artist: track.artist || 'Unknown Artist',
    albumTitle: track.albumTitle || track.album || '',
    coverUrl: track.coverUrl || track.cover || track.imageUrl || '',
    audioUrl: track.audioUrl || track.url || track.src || '',
    url: track.url || track.audioUrl || track.src || '',
    duration: track.duration || 0,
    emotion: track.emotion || track.mood || '',
    mood: track.mood || track.emotion || '',
    tags: track.tags || [],
    intensity: track.intensity || 0,
    year: track.year || undefined,
    category: track.category || undefined
  };
};

// Normalize playlists for compatibility
export const normalizePlaylist = (playlist: any): MusicPlaylist => {
  return {
    id: playlist.id || `playlist-${Date.now()}`,
    title: playlist.title || playlist.name || 'Unnamed Playlist',
    name: playlist.name || playlist.title || 'Unnamed Playlist',
    description: playlist.description || '',
    coverUrl: playlist.coverUrl || playlist.cover || playlist.imageUrl || '',
    coverImage: playlist.coverImage || playlist.coverUrl || playlist.cover || '',
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(normalizeTrack) : [],
    mood: playlist.mood || playlist.emotion || '',
    emotion: playlist.emotion || playlist.mood || '',
    category: playlist.category || undefined,
    creator: playlist.creator || undefined
  };
};

