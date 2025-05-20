
import { useState } from 'react';
import { EmotionResult } from '@/types/emotion';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { useToast } from '@/components/ui/use-toast';

interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export function useMusicEmotionIntegration() {
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get music recommendation based on emotion analysis
  const getMusicRecommendationForEmotion = async (emotionResult: EmotionResult): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      // This would typically call an API
      const emotion = emotionResult.emotion || emotionResult.primaryEmotion || 'neutral';
      
      // Mock playlist for now
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
        description: `Music to enhance your ${emotion} mood`,
        emotion: emotion,
        tracks: [
          { id: '1', title: 'Emotion Track 1', artist: 'Emotion Artist', url: 'https://example.com/track1.mp3', duration: 180 },
          { id: '2', title: 'Emotion Track 2', artist: 'Emotion Artist', url: 'https://example.com/track2.mp3', duration: 210 },
          { id: '3', title: 'Emotion Track 3', artist: 'Emotion Artist', url: 'https://example.com/track3.mp3', duration: 195 }
        ]
      };
      
      setCurrentPlaylist(mockPlaylist);
      return mockPlaylist;
    } catch (error) {
      console.error('Error getting music recommendation:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Activate music for a specific emotion
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      // This would typically call a music service API
      console.log(`Activating music for emotion: ${params.emotion} with intensity: ${params.intensity || 'default'}`);
      
      // Mock playlist
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        name: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Playlist`,
        description: `Music for ${params.emotion} mood`,
        emotion: params.emotion,
        tracks: [
          { id: '1', title: `${params.emotion} Track 1`, artist: 'Emotion Artist', url: 'https://example.com/track1.mp3', duration: 180 },
          { id: '2', title: `${params.emotion} Track 2`, artist: 'Emotion Artist', url: 'https://example.com/track2.mp3', duration: 210 },
          { id: '3', title: `${params.emotion} Track 3`, artist: 'Emotion Artist', url: 'https://example.com/track3.mp3', duration: 195 }
        ]
      };
      
      setCurrentPlaylist(mockPlaylist);
      
      toast({
        title: 'Music Activated',
        description: `Playing music for ${params.emotion} mood`,
        duration: 3000
      });
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error activating music:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Play music for an emotion
  const playEmotion = (emotion: string): Promise<MusicPlaylist | null> => {
    return activateMusicForEmotion({ emotion });
  };

  // Get description for an emotion's music
  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      happy: "Musique énergique et joyeuse pour accompagner votre bonne humeur",
      sad: "Mélodies apaisantes pour vous réconforter dans les moments difficiles",
      angry: "Rythmes dynamiques pour canaliser votre énergie",
      fear: "Sons relaxants pour apaiser votre anxiété",
      surprise: "Compositions légères et intrigantes",
      disgust: "Tonalités purifiantes pour transformer les émotions négatives",
      neutral: "Ambiance équilibrée pour maintenir votre calme",
      calm: "Douces mélodies pour approfondir votre tranquillité",
      excited: "Rythmes entraînants pour célébrer l'enthousiasme",
      stressed: "Sons apaisants pour réduire les tensions"
    };
    
    return descriptions[emotion.toLowerCase()] || 
      "Une sélection musicale adaptée à votre état émotionnel";
  };

  return {
    activateMusicForEmotion,
    getMusicRecommendationForEmotion,
    playEmotion,
    getEmotionMusicDescription,
    currentPlaylist,
    isLoading
  };
}

export default useMusicEmotionIntegration;
