import { MusicTrack, MusicPlaylist } from '@/types/music';

export const getTrackTitle = (track: MusicTrack): string => {
  return track.title || 'Sans titre';
};

export const getTrackArtist = (track: MusicTrack): string => {
  return track.artist || 'Artiste inconnu';
};

export const getTrackCover = (track: MusicTrack): string => {
  return track.cover || track.coverUrl || track.coverImage || '/images/music/default-cover.jpg';
};

export const getTrackUrl = (track: MusicTrack): string => {
  return track.url || track.audioUrl || track.src || track.track_url || '';
};

export const getPlaylistTitle = (playlist: MusicPlaylist): string => {
  return playlist.title || playlist.name || 'Playlist sans titre';
};

export const getPlaylistCover = (playlist: MusicPlaylist): string => {
  return playlist.cover || 
         playlist.coverUrl || 
         playlist.coverImage || 
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

// New helper utility functions to ensure compatibility between different music track/playlist formats

/**
 * Normalizes different track formats into the standard MusicTrack type
 */
export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || `track-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title: track.title || track.name || 'Sans titre',
    artist: track.artist || 'Artiste inconnu',
    duration: track.duration || 0,
    url: track.url || track.audioUrl || track.src || track.track_url || '',
    cover: track.cover || track.coverUrl || track.coverImage || '/images/music/default-cover.jpg',
    mood: track.mood || track.emotion ? [track.emotion] : ['calm'],
    album: track.album || '',
    tags: track.tags || [],
    category: track.category || 'ambient'
  };
};

/**
 * Converts a general playlist object to the standard MusicPlaylist format
 */
export const convertToMusicPlaylist = (playlist: any): MusicPlaylist => {
  const tracks = Array.isArray(playlist.tracks)
    ? playlist.tracks.map(normalizeTrack)
    : [];
    
  return {
    id: playlist.id || `playlist-${Date.now()}`,
    title: playlist.title || playlist.name || 'Playlist sans titre',
    description: playlist.description || '',
    cover: playlist.cover || playlist.coverUrl || playlist.coverImage || '',
    tracks: tracks,
    mood: typeof playlist.mood === 'string' ? [playlist.mood] : (playlist.mood || ['calm']),
    emotion: playlist.emotion || '',
    category: playlist.category || 'ambient',
    author: playlist.author || ''
  };
};

/**
 * Ensures that a playlist conforms to the standard MusicPlaylist format
 */
export const ensurePlaylist = (playlist: any): MusicPlaylist => {
  if (!playlist) {
    return {
      id: `empty-playlist-${Date.now()}`,
      title: 'Playlist vide',
      description: '',
      cover: '',
      tracks: [],
      mood: ['calm'],
      emotion: '',
      category: 'ambient',
      author: ''
    };
  }

  // If it's already a proper MusicPlaylist, just ensure tracks are normalized
  if (playlist.id && playlist.tracks) {
    return {
      ...playlist,
      tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(normalizeTrack) : [],
      mood: typeof playlist.mood === 'string' ? [playlist.mood] : (playlist.mood || ['calm'])
    };
  }

  // Otherwise convert it
  return convertToMusicPlaylist(playlist);
};
