
import { useState } from 'react';
import { EmotionResult } from '@/types/emotion';
import { MusicPlaylist } from '@/types/music';
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
          { id: '1', title: 'Emotion Track 1', artist: 'Emotion Artist', duration: 180 },
          { id: '2', title: 'Emotion Track 2', artist: 'Emotion Artist', duration: 210 },
          { id: '3', title: 'Emotion Track 3', artist: 'Emotion Artist', duration: 195 }
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
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<void> => {
    setIsLoading(true);
    try {
      // This would typically call a music service API
      console.log(`Activating music for emotion: ${params.emotion} with intensity: ${params.intensity || 'default'}`);
      
      toast({
        title: 'Music Activated',
        description: `Playing music for ${params.emotion} mood`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error activating music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Play music for an emotion
  const playEmotion = (emotion: string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      console.log(`Playing music for emotion: ${emotion}`);
      
      // Mock playlist
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
        description: `Music to enhance your ${emotion} mood`,
        emotion: emotion,
        tracks: [
          { id: '1', title: `${emotion} Track 1`, artist: 'Emotion Artist', duration: 180 },
          { id: '2', title: `${emotion} Track 2`, artist: 'Emotion Artist', duration: 210 },
          { id: '3', title: `${emotion} Track 3`, artist: 'Emotion Artist', duration: 195 }
        ]
      };
      
      setCurrentPlaylist(mockPlaylist);
      
      toast({
        title: 'Now Playing',
        description: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} music`,
        duration: 3000
      });
      
      setIsLoading(false);
      return Promise.resolve(mockPlaylist);
    } catch (error) {
      console.error('Error playing emotion music:', error);
      setIsLoading(false);
      return Promise.resolve(null);
    }
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
