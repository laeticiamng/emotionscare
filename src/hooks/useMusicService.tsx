
import { useState } from 'react';
import { MusicTrack } from '@/types';
import { mockTracks } from '@/data/mockMusic';

interface UseMusicServiceProps {
  initialTracks?: MusicTrack[];
}

export const useMusicService = ({ initialTracks = mockTracks }: UseMusicServiceProps = {}) => {
  const [tracks, setTracks] = useState<MusicTrack[]>(initialTracks);
  
  const getRecommendedTracks = async (emotion: string): Promise<MusicTrack[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter tracks by emotion, or return random tracks if no matches
    const matchingTracks = tracks.filter(track => 
      track.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    
    if (matchingTracks.length > 0) {
      return matchingTracks;
    }
    
    // Return some random tracks as fallback
    return [
      {
        id: '101',
        title: 'Adaptive Melody',
        artist: 'AI Composer',
        url: '/audio/adaptive-melody.mp3',
        audioUrl: '/audio/adaptive-melody.mp3',
        duration: 240,
        coverUrl: '/images/music/adaptive.jpg',
        emotion
      },
      {
        id: '102',
        title: 'Emotional Response',
        artist: 'Mood Match',
        url: '/audio/emotional-response.mp3',
        audioUrl: '/audio/emotional-response.mp3',
        duration: 210,
        coverUrl: '/images/music/response.jpg',
        emotion
      }
    ];
  };
  
  const getTrackById = async (id: string): Promise<MusicTrack | null> => {
    const track = tracks.find(track => track.id === id);
    return track || null;
  };
  
  return {
    tracks,
    getRecommendedTracks,
    getTrackById
  };
};

export default useMusicService;
