
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

/**
 * Ensures a playlist object conforms to MusicPlaylist interface
 */
export function ensurePlaylist(playlist: any): MusicPlaylist {
  if (!playlist) {
    return {
      id: 'empty',
      title: 'Empty Playlist',
      tracks: []
    };
  }
  
  return {
    id: playlist.id || 'playlist-' + Date.now(),
    title: playlist.title || playlist.name || 'Untitled Playlist',
    name: playlist.name || playlist.title || 'Untitled Playlist',
    description: playlist.description || '',
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(ensureTrack) : [],
    emotion: playlist.emotion || '',
    coverUrl: playlist.coverUrl || playlist.cover_url || '',
    userId: playlist.userId || playlist.user_id || '',
    isPublic: playlist.isPublic || false,
  };
}

/**
 * Ensures a track object conforms to MusicTrack interface
 */
export function ensureTrack(track: any): MusicTrack {
  if (!track) {
    return {
      id: 'empty',
      title: 'Unknown Track',
      url: '',
      duration: 0
    };
  }
  
  return {
    id: track.id || 'track-' + Date.now(),
    title: track.title || track.name || 'Untitled Track',
    artist: track.artist || 'Unknown Artist',
    album: track.album || '',
    url: track.url || track.src || track.audioUrl || '',
    audioUrl: track.audioUrl || track.url || track.src || '',
    coverUrl: track.coverUrl || track.cover_url || track.cover || '',
    duration: track.duration || 0,
    emotion: track.emotion || track.mood || '',
    genre: track.genre || '',
    isLiked: track.isLiked || false,
    mood: track.mood || track.emotion || '',
  };
}

/**
 * Convert from one playlist format to MusicPlaylist
 */
export function convertToPlaylist(data: any): MusicPlaylist {
  return ensurePlaylist(data);
}

/**
 * Find tracks by mood/emotion in a collection of tracks
 */
export function findTracksByMood(tracks: MusicTrack[], mood: string): MusicTrack[] {
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) return [];
  
  const normalizedMood = mood.toLowerCase();
  
  return tracks.filter(track => {
    const trackEmotion = (track.emotion || '').toLowerCase();
    const trackMood = (track.mood || '').toLowerCase();
    
    return trackEmotion.includes(normalizedMood) || 
           normalizedMood.includes(trackEmotion) ||
           trackMood.includes(normalizedMood) ||
           normalizedMood.includes(trackMood);
  });
}

/**
 * Create a music params object from emotion string or object
 */
export function createMusicParams(emotion: string | EmotionMusicParams): EmotionMusicParams {
  if (typeof emotion === 'string') {
    return { emotion };
  }
  return emotion;
}
