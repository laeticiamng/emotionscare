
import { MusicTrack, MusicPlaylist, MusicQueueItem, EmotionMusicParams } from '@/types/music';

// Function to ensure playlist compatibility between different interface versions
export function ensurePlaylist(playlist: any): MusicPlaylist {
  if (!playlist) return {
    id: 'default-empty',
    title: 'Liste vide',
    tracks: [],
  };

  // Ensure the playlist has an id
  const ensuredPlaylist = {
    ...playlist,
    id: playlist.id || `playlist-${Date.now()}`,
    title: playlist.title || playlist.name || 'Playlist sans titre',
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(ensureTrack) : [],
  };

  return ensuredPlaylist;
}

// Function to ensure track compatibility
export function ensureTrack(track: any): MusicTrack {
  if (!track) return {
    id: 'empty-track',
    title: 'Piste non disponible',
    artist: 'Inconnu',
    url: '',
  };

  return {
    ...track,
    id: track.id || `track-${Date.now()}`,
    title: track.title || track.name || 'Sans titre',
    artist: track.artist || 'Artiste inconnu',
    url: track.url || track.audioUrl || track.src || track.track_url || '',
    cover: track.cover || track.coverUrl || track.coverImage || '',
  };
}

// Function to get track cover (with fallback)
export function getTrackCover(track: MusicTrack | null): string {
  if (!track) return '';
  return track.cover || track.coverUrl || track.coverImage || '';
}

// Function to get track title (with fallback)
export function getTrackTitle(track: MusicTrack | null): string {
  if (!track) return 'Sans titre';
  return track.title || track.name || 'Sans titre';
}

// Function to get track artist (with fallback)
export function getTrackArtist(track: MusicTrack | null): string {
  if (!track) return 'Artiste inconnu';
  return track.artist || 'Artiste inconnu';
}

// Function to get track URL (with fallback)
export function getTrackUrl(track: MusicTrack | null): string {
  if (!track) return '';
  return track.url || track.audioUrl || track.src || track.track_url || '';
}

// Function to normalize a track to ensure all required properties
export function normalizeTrack(track: any): MusicTrack {
  return ensureTrack(track);
}

// Function to ensure an item is an array
export function ensureArray<T>(item: T | T[] | null | undefined): T[] {
  if (Array.isArray(item)) return item;
  if (item === null || item === undefined) return [];
  return [item];
}

// Function to map audioUrl to url (for compatibility)
export function mapAudioUrlToUrl(track: MusicTrack): MusicTrack {
  if (!track.url && track.audioUrl) {
    return {
      ...track,
      url: track.audioUrl
    };
  }
  return track;
}

// Support for getRecommendationByEmotion for compatibility
export async function getRecommendationByEmotion(
  params: string | EmotionMusicParams
): Promise<MusicPlaylist | null> {
  // Simple implementation for compatibility
  const emotion = typeof params === 'string' ? params : params.emotion || 'calm';
  
  // Return a simulated playlist based on emotion
  return {
    id: `playlist-${emotion}`,
    title: `Musique pour ${emotion}`,
    tracks: [
      {
        id: `track-${emotion}-1`,
        title: `Mélodie ${emotion} 1`,
        artist: 'EmotionsCare Music',
        url: '',
      },
      {
        id: `track-${emotion}-2`,
        title: `Mélodie ${emotion} 2`,
        artist: 'EmotionsCare Music',
        url: '',
      }
    ],
    emotion: emotion,
  };
}

// Interface for type marker "Playlist"
export interface Playlist {
  id: string;
  name: string;
  tracks: any[];
}

// Helper function to convert MusicPlaylist to Playlist
export function convertToPlaylist(musicPlaylist: MusicPlaylist): Playlist {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.title || musicPlaylist.name || 'Sans titre',
    tracks: musicPlaylist.tracks,
  };
}

// Helper function to convert Playlist to MusicPlaylist
export function convertToMusicPlaylist(playlist: Playlist): MusicPlaylist {
  return {
    id: playlist.id,
    title: playlist.name,
    tracks: playlist.tracks.map(ensureTrack),
  };
}
