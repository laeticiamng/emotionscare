
import { MusicTrack, MusicPlaylist, MusicQueueItem, EmotionMusicParams } from '@/types/music';

// Fonction pour garantir la compatibilité entre les versions d'interfaces musicales
export function ensurePlaylist(playlist: any): MusicPlaylist {
  if (!playlist) return {
    id: 'default-empty',
    title: 'Liste vide',
    tracks: [],
  };

  // Assurer que le playlist a un id
  const ensuredPlaylist = {
    ...playlist,
    id: playlist.id || `playlist-${Date.now()}`,
    title: playlist.title || playlist.name || 'Playlist sans titre',
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(ensureTrack) : [],
  };

  return ensuredPlaylist;
}

// Fonction pour assurer la compatibilité des pistes
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

// Support de getRecommendationByEmotion pour la compatibilité
export async function getRecommendationByEmotion(
  params: string | EmotionMusicParams
): Promise<MusicPlaylist | null> {
  // Implémentation simple pour la compatibilité
  const emotion = typeof params === 'string' ? params : params.emotion || 'calm';
  
  // Retourne une playlist simulée basée sur l'émotion
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

// Interface pour marqueur de type "Playlist"
export interface Playlist {
  id: string;
  name: string;
  tracks: any[];
}

// Fonction d'aide pour convertir MusicPlaylist en Playlist
export function convertToPlaylist(musicPlaylist: MusicPlaylist): Playlist {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.title || musicPlaylist.name || 'Sans titre',
    tracks: musicPlaylist.tracks,
  };
}
