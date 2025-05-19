
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { mockTracks } from '@/contexts/music/mockMusicData';

// Map audioUrl to url for compatibility
export const mapAudioUrlToUrl = (track: MusicTrack): MusicTrack => {
  return {
    ...track,
    url: track.audioUrl // For backward compatibility
  };
};

// Find tracks by mood
export const findTracksByMood = (mood: string): MusicTrack[] => {
  return mockTracks.filter(track => 
    track.mood === mood || 
    track.emotion === mood || 
    (track.tags && track.tags.includes(mood))
  );
};

// Map between different audio formats
export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}`,
    title: track.title || track.name || 'Unknown Track',
    artist: track.artist || 'Unknown Artist',
    albumTitle: track.albumTitle || track.album || '',
    coverUrl: track.coverUrl || track.cover || track.imageUrl || '',
    audioUrl: track.audioUrl || track.url || track.src || '',
    duration: track.duration || 0,
    emotion: track.emotion || track.mood || '',
    tags: (Array.isArray(track.tags) ? track.tags.join(',') : track.tags) || ''
  };
};

// Normalize playlists for compatibility
export const normalizePlaylist = (playlist: any): MusicPlaylist => {
  return {
    id: playlist.id || `playlist-${Date.now()}`,
    title: playlist.title || playlist.name || 'Unnamed Playlist',
    description: playlist.description || '',
    coverUrl: playlist.coverUrl || playlist.cover || playlist.imageUrl || '',
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(normalizeTrack) : [],
    mood: playlist.mood || playlist.emotion || ''
  };
};
