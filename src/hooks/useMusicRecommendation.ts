
import { useState } from 'react';
import { MusicTrack } from '@/types/music';

const useMusicRecommendation = () => {
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendations = async (emotion?: string): Promise<MusicTrack[]> => {
    setIsLoading(true);
    
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRecommendations: MusicTrack[] = [
      {
        id: '1',
        title: 'Relaxing Ambient',
        artist: 'Nature Sounds',
        url: '/audio/ambient.mp3',
        duration: 300,
        emotion: emotion || 'calm'
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsLoading(false);
    return mockRecommendations;
  };

  return {
    recommendations,
    isLoading,
    getRecommendations
  };
};

export default useMusicRecommendation;
