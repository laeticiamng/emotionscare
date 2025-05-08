
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMusicRecommendationEngine } from "@/hooks/useMusicRecommendationEngine";
import { EmotionResult } from '@/types';

export const useMusicRecommendation = () => {
  const { toast } = useToast();
  const { getRecommendationsForEmotion } = useMusicRecommendationEngine();

  // Define emotion to music mapping
  const EMOTION_TO_MUSIC = {
    'happy': 'Musique entraînante',
    'sad': 'Musique apaisante',
    'angry': 'Musique calmante',
    'anxious': 'Sons de méditation',
    'neutral': 'Musique douce',
    'calm': 'Sons de nature',
    'stressed': 'Musique relaxante',
    'energetic': 'Musique dynamique',
    'bored': 'Musique stimulante',
    'tired': 'Musique méditative',
    'fearful': 'Musique enveloppante',
    'default': 'Musique apaisante'
  };

  const handlePlayMusic = useCallback((emotionResult: EmotionResult) => {
    if (!emotionResult || !emotionResult.emotion) {
      toast({
        title: "Pas d'émotion détectée",
        description: "Nous n'avons pas pu détecter votre émotion pour vous recommander une musique",
        variant: "destructive",
      });
      return;
    }

    const { emotion } = emotionResult;
    const recommendations = getRecommendationsForEmotion(emotion.toLowerCase());

    if (recommendations && recommendations.length > 0) {
      // Here you would typically trigger your music player with the recommendation
      toast({
        title: "Musique recommandée",
        description: `Nous vous suggérons d'écouter une ${EMOTION_TO_MUSIC[emotion.toLowerCase()] || EMOTION_TO_MUSIC.default}`,
      });
      
      // This is where you would actually play the music
      console.log('Playing music for emotion:', emotion, 'Recommendation:', recommendations[0]);
    } else {
      toast({
        title: "Aucune recommandation disponible",
        description: "Nous n'avons pas de musique à vous recommander pour le moment",
        variant: "destructive",
      });
    }
  }, [toast, getRecommendationsForEmotion]);

  return {
    handlePlayMusic,
    EMOTION_TO_MUSIC
  };
};
