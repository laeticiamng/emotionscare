
import { Emotion, EmotionResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { createFallbackEmotion } from '@/mocks/aiFallback';

export interface EnhancedEmotionResult extends EmotionResult {
  confidence: number;
  recommendations: string[];
}

/**
 * Service amélioré pour l'analyse émotionnelle
 */
export const enhancedEmotionalAnalysis = async (
  userId: string,
  text?: string,
  emojis?: string,
  audioUrl?: string,
  userContext?: {
    recent_emotions?: string;
    emotional_trend?: string;
    job_role?: string;
  }
): Promise<EnhancedEmotionResult> => {
  try {
    console.log('Analyzing emotion with enhanced service for user:', userId);
    
    // Appel à la fonction Edge améliorée pour l'analyse émotionnelle
    const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
      body: {
        text,
        emojis,
        audio_url: audioUrl,
        user_id: userId,
        user_context: userContext
      }
    });

    if (error) {
      console.error('Error calling enhanced-emotion-analyze function:', error);
      throw error;
    }

    console.log('Enhanced emotion analysis result:', data);
    
    // Convertir la réponse au format EnhancedEmotionResult
    const result: EnhancedEmotionResult = {
      emotion: data.emotion || 'neutral',
      confidence: data.confidence || 0.5,
      feedback: data.feedback || '',
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      transcript: text
    };

    // Enregistrer l'émotion analysée dans la base de données
    await saveEnhancedEmotionToDatabase(userId, result, text, emojis, audioUrl);

    return result;
  } catch (error) {
    console.error('Error in enhancedEmotionalAnalysis:', error);
    
    // En cas d'erreur, utiliser un résultat par défaut
    return {
      emotion: 'neutral',
      confidence: 0.5,
      feedback: 'Une erreur est survenue lors de l\'analyse. Veuillez réessayer plus tard.',
      recommendations: [
        'Prenez quelques respirations profondes',
        'Hydratez-vous',
        'Faites une courte pause'
      ],
      transcript: text
    };
  }
};

/**
 * Sauvegarder l'émotion analysée dans la base de données
 */
async function saveEnhancedEmotionToDatabase(
  userId: string,
  result: EnhancedEmotionResult,
  text?: string,
  emojis?: string,
  audioUrl?: string
): Promise<void> {
  try {
    const emotionData = {
      user_id: userId,
      date: new Date().toISOString(),
      emotion: result.emotion,
      score: calculateScoreFromEmotion(result.emotion),
      text,
      emojis,
      audio_url: audioUrl,
      ai_feedback: result.feedback,
      confidence: result.confidence,
      recommendations: result.recommendations,
      source: 'enhanced_api'
    };

    const { error } = await supabase
      .from('emotions')
      .insert(emotionData);

    if (error) {
      console.error('Error saving enhanced emotion to database:', error);
    }
  } catch (error) {
    console.error('Error in saveEnhancedEmotionToDatabase:', error);
  }
}

/**
 * Calculer un score basé sur l'émotion
 */
function calculateScoreFromEmotion(emotion: string): number {
  const emotionScores: Record<string, number> = {
    happy: 85,
    calm: 70,
    focused: 75,
    anxious: 35,
    sad: 25,
    angry: 20,
    frustrated: 30,
    tired: 40,
    energetic: 80,
    neutral: 50
  };

  return emotionScores[emotion.toLowerCase()] || 50;
}
