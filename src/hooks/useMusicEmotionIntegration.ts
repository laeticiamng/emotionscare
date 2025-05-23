
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: Array<{
    title: string;
    artist: string;
    duration: number;
    url?: string;
  }>;
  coverUrl?: string;
}

export function useMusicEmotionIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);

  const getMusicRecommendationForEmotion = async (emotionResult: EmotionResult): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('music-generation', {
        body: { 
          emotion: getEmotionFromScore(emotionResult.score),
          score: emotionResult.score,
          prompt: emotionResult.text || emotionResult.emojis
        }
      });
      
      if (error) throw error;
      
      // In a real application, this would return actual music URLs
      // For now, we create a mock playlist based on the emotion
      const mockPlaylist = createMockPlaylist(emotionResult.score);
      setCurrentPlaylist(mockPlaylist);
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error getting music recommendation:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const playEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      
      // Generate a mock score based on the emotion
      const mockScore = getMockScoreForEmotion(emotion);
      
      // Create a mock playlist
      const mockPlaylist = createMockPlaylist(mockScore);
      setCurrentPlaylist(mockPlaylist);
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error playing emotion music:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionFromScore = (score: number): string => {
    if (score >= 80) return 'joy';
    if (score >= 65) return 'happiness';
    if (score >= 50) return 'contentment';
    if (score >= 35) return 'melancholy';
    return 'sadness';
  };

  const getMockScoreForEmotion = (emotion: string): number => {
    const emotionMap: Record<string, number> = {
      'joy': 85,
      'happiness': 75,
      'contentment': 60,
      'melancholy': 40,
      'sadness': 25,
      'anger': 30,
      'fear': 35,
      'surprise': 60,
      'disgust': 30,
      'neutral': 50
    };
    
    return emotionMap[emotion.toLowerCase()] || 50;
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      'joy': 'Musique énergique et entraînante pour célébrer votre joie',
      'happiness': 'Mélodies positives pour maintenir votre bonne humeur',
      'contentment': 'Sons relaxants et mélodieux pour vous accompagner',
      'melancholy': 'Compositions douces et réfléchies pour les moments nostalgiques',
      'sadness': 'Musiques apaisantes pour vous réconforter et vous soutenir',
      'anger': 'Rythmes pour canaliser et transformer votre énergie',
      'fear': 'Sons calmes pour apaiser l'anxiété et retrouver la sérénité',
      'surprise': 'Mélodies rafraîchissantes et légères pour accompagner ce moment',
      'disgust': 'Musiques transformatives pour améliorer votre état d'esprit',
      'neutral': 'Ambiances équilibrées pour accompagner votre journée'
    };
    
    return descriptions[emotion.toLowerCase()] || 'Musique personnalisée adaptée à votre humeur';
  };

  const createMockPlaylist = (score: number): MusicPlaylist => {
    const emotion = getEmotionFromScore(score);
    
    const playlistTemplates: Record<string, MusicPlaylist> = {
      'joy': {
        id: 'playlist-joy',
        name: 'Énergie Positive',
        tracks: [
          { title: 'Happy Day', artist: 'Sunshine Band', duration: 210 },
          { title: 'Celebration', artist: 'Joy Collective', duration: 187 },
          { title: 'Dance of Life', artist: 'Rhythm Explorers', duration: 224 }
        ],
        coverUrl: 'https://images.unsplash.com/photo-1520338801623-6b88fe32e80a'
      },
      'happiness': {
        id: 'playlist-happiness',
        name: 'Rayons de soleil',
        tracks: [
          { title: 'Gentle Smile', artist: 'Happy Tones', duration: 195 },
          { title: 'Summer Breeze', artist: 'Coastal Vibes', duration: 230 },
          { title: 'Light Steps', artist: 'Morning Walk', duration: 212 }
        ],
        coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5'
      },
      'contentment': {
        id: 'playlist-contentment',
        name: 'Équilibre et harmonie',
        tracks: [
          { title: 'Peaceful Mind', artist: 'Balanced Soul', duration: 245 },
          { title: 'Gentle Stream', artist: 'Nature Sounds', duration: 287 },
          { title: 'Quiet Moments', artist: 'Tranquil Quartet', duration: 263 }
        ],
        coverUrl: 'https://images.unsplash.com/photo-1519834089823-af6afa22ec36'
      },
      'melancholy': {
        id: 'playlist-melancholy',
        name: 'Douce contemplation',
        tracks: [
          { title: 'Rainy Day', artist: 'Blue Notes', duration: 312 },
          { title: 'Memories', artist: 'Nostalgic Piano', duration: 275 },
          { title: 'Distant Shore', artist: 'Ocean Waves', duration: 298 }
        ],
        coverUrl: 'https://images.unsplash.com/photo-1604334223153-8923f4100f4e'
      },
      'sadness': {
        id: 'playlist-sadness',
        name: 'Réconfort émotionnel',
        tracks: [
          { title: 'Healing Touch', artist: 'Gentle Soul', duration: 328 },
          { title: 'New Dawn', artist: 'Hope Ensemble', duration: 304 },
          { title: 'Inner Light', artist: 'Soul Comfort', duration: 285 }
        ],
        coverUrl: 'https://images.unsplash.com/photo-1454618454636-a42c7330ecce'
      }
    };
    
    return playlistTemplates[emotion] || playlistTemplates['contentment'];
  };

  return {
    isLoading,
    currentPlaylist,
    getMusicRecommendationForEmotion,
    playEmotion,
    getEmotionMusicDescription
  };
}

export default useMusicEmotionIntegration;
