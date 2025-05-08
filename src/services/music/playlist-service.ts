import { Playlist } from './types';
import { convertMusicPlaylistToPlaylist } from './converters';
import { MusicPlaylist } from '@/types';

// Données mockées de playlists pour le développement
const mockPlaylists: Record<string, MusicPlaylist> = {
  'meditation': {
    id: 'meditation-playlist',
    name: 'Méditation profonde',
    emotion: 'calm',
    tracks: [
      {
        id: 'meditation-1',
        title: 'Inner Peace',
        artist: 'Zen Garden',
        duration: 360,
        audioUrl: 'https://example.com/meditation1.mp3',
        url: 'https://example.com/meditation1.mp3',
        coverUrl: '/images/meditation1.jpg'
      },
      {
        id: 'meditation-2',
        title: 'Mindful Morning',
        artist: 'Breath Collective',
        duration: 480,
        audioUrl: 'https://example.com/meditation2.mp3',
        url: 'https://example.com/meditation2.mp3',
        coverUrl: '/images/meditation2.jpg'
      }
    ]
  },
  'focus': {
    id: 'focus-playlist',
    name: 'Concentration maximale',
    emotion: 'focused',
    tracks: [
      {
        id: 'focus-1',
        title: 'Deep Work',
        artist: 'Productivity Sound',
        duration: 300,
        audioUrl: 'https://example.com/focus1.mp3',
        url: 'https://example.com/focus1.mp3',
        coverUrl: '/images/focus1.jpg'
      },
      {
        id: 'focus-2',
        title: 'Flow State',
        artist: 'Mind Waves',
        duration: 320,
        audioUrl: 'https://example.com/focus2.mp3',
        url: 'https://example.com/focus2.mp3',
        coverUrl: '/images/focus2.jpg'
      }
    ]
  }
};

/**
 * Récupère une playlist par ID
 */
export const getPlaylist = async (id: string): Promise<Playlist | null> => {
  try {
    // Simuler une requête API
    console.log(`Récupération de la playlist: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Dans une implémentation réelle, on ferait un appel à l'API
    const mockPlaylist = mockPlaylists[id];
    
    if (mockPlaylist) {
      return convertMusicPlaylistToPlaylist(mockPlaylist);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return null;
  }
};

/**
 * Récupère toutes les playlists disponibles
 */
export const getAllPlaylists = async (): Promise<Playlist[]> => {
  try {
    // Simuler une requête API
    console.log('Récupération de toutes les playlists');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dans une implémentation réelle, on ferait un appel à l'API
    return Object.values(mockPlaylists).map(playlist => 
      convertMusicPlaylistToPlaylist(playlist)
    );
  } catch (error) {
    console.error('Error fetching all playlists:', error);
    return [];
  }
};

/**
 * Récupère les playlists recommandées basées sur l'émotion
 */
export const getRecommendedPlaylists = async (emotion: string): Promise<Playlist[]> => {
  try {
    // Simuler une requête API
    console.log(`Récupération des playlists recommandées pour l'émotion: ${emotion}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Dans une implémentation réelle, on ferait un appel à l'API avec l'émotion comme paramètre
    return Object.values(mockPlaylists)
      .filter(playlist => playlist.emotion.includes(emotion.toLowerCase()))
      .map(playlist => convertMusicPlaylistToPlaylist(playlist));
  } catch (error) {
    console.error('Error fetching recommended playlists:', error);
    return [];
  }
};
