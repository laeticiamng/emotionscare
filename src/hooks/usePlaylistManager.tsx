
import { useState, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { mockPlaylists } from '@/data/mockMusic';

export const usePlaylistManager = () => {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction helper pour normaliser une track
  const normalizeTrack = (track: any): MusicTrack => {
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration || 0, // S'assurer que duration est définie
      url: track.url || track.audioUrl || track.audio_url || '', // S'assurer que url est définie
      coverUrl: track.coverUrl || track.cover_url || track.cover || '',
      emotion: track.emotion || track.emotion_tag || '',
    };
  };

  // Charge toutes les playlists
  const loadAllPlaylists = useCallback(async () => {
    setIsLoading(true);
    try {
      // En production, cette fonction ferait un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      setPlaylists(mockPlaylists);
    } catch (error) {
      console.error("Erreur lors du chargement des playlists:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charge une playlist pour une émotion spécifique
  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      const matchingPlaylist = mockPlaylists.find(p => 
        p.emotion && p.emotion.toLowerCase() === emotion.toLowerCase()
      );
      
      if (matchingPlaylist) {
        return {
          ...matchingPlaylist,
          tracks: matchingPlaylist.tracks.map(normalizeTrack)
        };
      }
      
      // Si aucune playlist ne correspond exactement, créer une playlist personnalisée
      // avec des tracks qui correspondent à l'émotion
      const tracks: MusicTrack[] = [];
      
      // Dans une vraie application, nous ferions un appel API ici
      // pour obtenir des pistes adaptées à l'émotion
      const customTracks = [
        {
          id: `${emotion}-1`,
          title: "Ambient Calm",
          artist: "Zen Music",
          duration: 240,
          url: "/audio/ambient-calm.mp3",
          emotion: emotion
        },
        {
          id: `${emotion}-2`,
          title: "Nature Sounds",
          artist: "Relaxation Channel",
          duration: 320,
          url: "/audio/nature-sounds.mp3",
          emotion: emotion
        },
        {
          id: `${emotion}-3`,
          title: "Deep Focus",
          artist: "Concentration Music",
          duration: 420,
          url: "/audio/deep-focus.mp3",
          emotion: emotion
        }
      ];
      
      return {
        id: `playlist-${emotion}`,
        name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood`,
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood`, // Pour la compatibilité
        description: `Music tailored for your ${emotion} mood`,
        coverUrl: `/images/emotions/${emotion}.jpg`,
        emotion: emotion,
        tracks: customTracks.map(normalizeTrack)
      };
    } catch (error) {
      console.error(`Erreur lors du chargement de la playlist pour l'émotion ${emotion}:`, error);
      return null;
    }
  }, []);

  // Charge les playlists au montage du composant
  useEffect(() => {
    loadAllPlaylists();
  }, [loadAllPlaylists]);

  // Crée une nouvelle playlist
  const createPlaylist = async (name: string, tracks: MusicTrack[] = []): Promise<MusicPlaylist> => {
    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      title: name, // Pour la compatibilité
      description: `Playlist: ${name}`,
      coverUrl: tracks.length > 0 ? tracks[0].coverUrl || '/images/default-cover.jpg' : '/images/default-cover.jpg',
      tracks: tracks.map(normalizeTrack)
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  // Ajoute une track à une playlist
  const addTrackToPlaylist = (playlistId: string, track: MusicTrack): boolean => {
    let success = false;

    setPlaylists(prev => {
      const updatedPlaylists = prev.map(playlist => {
        if (playlist.id === playlistId) {
          // Vérifier si la track existe déjà dans la playlist
          const trackExists = playlist.tracks.some(t => t.id === track.id);
          if (!trackExists) {
            success = true;
            return {
              ...playlist,
              tracks: [...playlist.tracks, normalizeTrack(track)]
            };
          }
        }
        return playlist;
      });

      return updatedPlaylists;
    });

    return success;
  };

  // Supprime une track d'une playlist
  const removeTrackFromPlaylist = (playlistId: string, trackId: string): boolean => {
    let success = false;

    setPlaylists(prev => {
      const updatedPlaylists = prev.map(playlist => {
        if (playlist.id === playlistId) {
          success = true;
          return {
            ...playlist,
            tracks: playlist.tracks.filter(track => track.id !== trackId)
          };
        }
        return playlist;
      });

      return updatedPlaylists;
    });

    return success;
  };

  return {
    playlists,
    isLoading,
    loadAllPlaylists,
    loadPlaylistForEmotion,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist
  };
};

export default usePlaylistManager;
