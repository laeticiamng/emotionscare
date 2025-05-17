
import { useState } from 'react';
import { MusicPlaylist } from '@/types/music';

export function useMusicPlaylist() {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      // Dans une vraie application, nous ferions un appel API ici
      // Pour l'instant, on utilise des données simulées
      const mockPlaylists: MusicPlaylist[] = [
        {
          id: 'playlist-1',
          title: 'Relaxation Profonde',
          tracks: [
            { id: 'track-1', title: 'Ocean Waves', artist: 'Nature Sounds', duration: 180 },
            { id: 'track-2', title: 'Forest Ambiance', artist: 'Nature Sounds', duration: 210 },
            { id: 'track-3', title: 'Gentle Rain', artist: 'Nature Sounds', duration: 195 },
          ],
          mood: 'calm'
        },
        {
          id: 'playlist-2',
          title: 'Énergie Positive',
          tracks: [
            { id: 'track-4', title: 'Morning Boost', artist: 'Happy Vibes', duration: 150 },
            { id: 'track-5', title: 'Ready for Success', artist: 'Motivation', duration: 180 },
            { id: 'track-6', title: 'Rise and Shine', artist: 'Happy Vibes', duration: 165 },
          ],
          mood: 'happy'
        }
      ];
      
      setPlaylists(mockPlaylists);
      
      if (!currentPlaylist && mockPlaylists.length > 0) {
        setCurrentPlaylist(mockPlaylists[0]);
      }
      
      return mockPlaylists;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = (playlist: MusicPlaylist) => {
    setPlaylists(prevPlaylists => [...prevPlaylists, playlist]);
    return playlist;
  };

  const updatePlaylist = (playlistId: string, updates: Partial<MusicPlaylist>) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.map(playlist => 
        playlist.id === playlistId ? { ...playlist, ...updates } : playlist
      )
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.filter(playlist => playlist.id !== playlistId)
    );
    
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null);
    }
  };

  const selectPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId) || null;
    setCurrentPlaylist(playlist);
    return playlist;
  };

  return {
    playlists,
    loading,
    currentPlaylist,
    fetchPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    selectPlaylist
  };
}

export default useMusicPlaylist;
