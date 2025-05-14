
import { useState, useEffect } from 'react';
import { Emotion, MusicTrack } from '@/types';

interface MusicRecommendation {
  trackId: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
  emotion: string;
  intensity: number;
  confidence: number;
}

export const useMusicEmotionIntegration = (emotion?: Emotion | null) => {
  const [recommendation, setRecommendation] = useState<MusicRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!emotion) return;

    const fetchRecommendation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Default intensity if not provided
        const intensityValue = emotion.intensity || 0.5;
        
        // Mock music recommendation based on emotion
        const mockTrack: MusicRecommendation = {
          trackId: `track-${Date.now()}`,
          title: getTrackTitleByEmotion(emotion.emotion || 'neutral', intensityValue),
          artist: "AI Composer",
          url: "#", // In a real app, this would be an actual audio URL
          coverUrl: "/images/music-cover.jpg",
          emotion: emotion.emotion || 'neutral',
          intensity: intensityValue,
          confidence: 0.85
        };
        
        setRecommendation(mockTrack);
      } catch (err: any) {
        setError(new Error(err.message || 'Failed to get music recommendation'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [emotion]);

  return { recommendation, isLoading, error };
};

// Helper function to generate track titles based on emotion and intensity
function getTrackTitleByEmotion(emotion: string, intensity: number): string {
  const intensityLabel = intensity < 0.4 ? "Douce" : intensity > 0.7 ? "Intense" : "Modérée";
  
  const emotionTitles: Record<string, string> = {
    calm: `Sérénité ${intensityLabel}`,
    happy: `Joie ${intensityLabel}`,
    sad: `Mélancolie ${intensityLabel}`,
    angry: `Transformation de Colère ${intensityLabel}`,
    excited: `Énergie ${intensityLabel}`,
    focused: `Concentration ${intensityLabel}`,
    anxious: `Apaisement d'Anxiété ${intensityLabel}`,
    tired: `Revitalisation ${intensityLabel}`,
    stressed: `Relaxation Anti-Stress ${intensityLabel}`,
    neutral: `Équilibre ${intensityLabel}`
  };

  return emotionTitles[emotion] || `Harmonie ${intensityLabel}`;
}

export default useMusicEmotionIntegration;
