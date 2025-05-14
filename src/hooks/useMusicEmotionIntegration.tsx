
import { useState, useEffect } from 'react';
import { EmotionResult } from '@/types/emotion';

export interface MusicRecommendation {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  trackUrl?: string;
  emotion: string;
  intensity?: number;
  bpm?: number;
  duration?: number;
  isFavorite?: boolean;
}

export const useMusicEmotionIntegration = (emotionResult?: EmotionResult) => {
  const [recommendation, setRecommendation] = useState<MusicRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!emotionResult) return;

    const fetchRecommendation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This would normally call an API, but we'll simulate it
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on emotion
        const emotion = emotionResult.dominantEmotion || 
                        emotionResult.primaryEmotion || 
                        emotionResult.emotion || 
                        'calm';
                        
        const intensity = emotionResult.intensity || 0.5;
        
        setRecommendation({
          id: `music-${Date.now()}`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Melodies`,
          description: `Music specially selected to complement your ${emotion} state`,
          emotion: emotion,
          intensity: intensity,
          coverUrl: `https://source.unsplash.com/random/300x300/?music,${emotion}`,
          bpm: intensity > 0.7 ? 120 : intensity > 0.4 ? 90 : 70,
          duration: 180 + Math.random() * 120
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get music recommendation'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [emotionResult]);

  const activateMusicForEmotion = async (emotion: string, intensity?: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRecommendation({
        id: `music-${Date.now()}`,
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Focus`,
        description: `Ambient music designed for ${emotion} states`,
        emotion: emotion,
        intensity: intensity || 0.5,
        coverUrl: `https://source.unsplash.com/random/300x300/?music,${emotion}`,
        bpm: intensity && intensity > 0.7 ? 110 : 80,
        duration: 240 + Math.random() * 180
      });
      
      return true;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to activate music'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions = {
      happy: "Uplifting and energetic melodies to enhance your positive mood",
      calm: "Gentle, soothing sounds to maintain your peaceful state",
      sad: "Comforting harmonies that acknowledge and process feelings",
      anxious: "Grounding rhythms to help stabilize your emotional state",
      angry: "Transformative progressions to channel intensity constructively",
      neutral: "Balanced compositions to maintain focus and clarity",
      focused: "Consistent rhythms optimized for concentration and flow",
      energetic: "Dynamic beats to complement and direct your energy"
    };
    
    return descriptions[emotion as keyof typeof descriptions] || 
      "Music tailored to your current emotional state";
  };

  return {
    recommendation,
    isLoading,
    error,
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
};

export default useMusicEmotionIntegration;
