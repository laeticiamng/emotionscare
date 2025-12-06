// @ts-nocheck
import { useState } from 'react';
import { MusicTrack } from '@/types/music';

export const useMusicService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);

  const searchTracks = async (query: string): Promise<MusicTrack[]> => {
    setIsLoading(true);
    
    // Simulation d'une recherche
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTracks: MusicTrack[] = [
      {
        id: '1',
        title: `Résultat pour "${query}"`,
        artist: 'Artiste Test',
        url: '/audio/sample.mp3',
        duration: 180,
        emotion: 'calm'
      }
    ];
    
    setTracks(mockTracks);
    setIsLoading(false);
    return mockTracks;
  };

  return {
    tracks,
    isLoading,
    searchTracks
  };
};
