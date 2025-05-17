
import { useState, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: Track[];
}

export function useMusicPlaylist() {
  const [playlists, setPlaylists] = useState<AudioPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<AudioPlaylist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement de playlists depuis une API
    const loadPlaylists = async () => {
      try {
        setLoading(true);
        
        // Données fictives
        const mockPlaylists: AudioPlaylist[] = [
          {
            id: '1',
            name: 'Méditation du matin',
            title: 'Méditation du matin',
            description: 'Sons apaisants pour bien commencer la journée',
            tracks: [
              { id: '101', title: 'Lever de soleil', artist: 'Nature Sounds', url: '/audio/sunrise.mp3', duration: 180 },
              { id: '102', title: 'Ruisseau tranquille', artist: 'Nature Sounds', url: '/audio/stream.mp3', duration: 240 },
              { id: '103', title: 'Respiration guidée', artist: 'Mindfulness Coach', url: '/audio/breathing.mp3', duration: 300 }
            ]
          },
          {
            id: '2',
            name: 'Focus au travail',
            title: 'Focus au travail',
            description: 'Musique pour rester concentré pendant votre journée',
            tracks: [
              { id: '201', title: 'Productivité', artist: 'Deep Focus', url: '/audio/productivity.mp3', duration: 360 },
              { id: '202', title: 'Flux créatif', artist: 'Brain Waves', url: '/audio/creative-flow.mp3', duration: 420 },
              { id: '203', title: 'Concentration intense', artist: 'Deep Focus', url: '/audio/deep-focus.mp3', duration: 390 }
            ]
          }
        ];
        
        setPlaylists(mockPlaylists);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des playlists:', error);
        setLoading(false);
      }
    };
    
    loadPlaylists();
  }, []);
  
  return { playlists, currentPlaylist, setCurrentPlaylist, loading };
}

export default useMusicPlaylist;
