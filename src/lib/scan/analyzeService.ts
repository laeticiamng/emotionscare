
import { Emotion, EmotionResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { createFallbackEmotion, getFallbackEmotionAnalysis } from '@/mocks/aiFallback';

/**
 * Analyser le texte et les émojis pour détecter l'émotion
 */
export async function analyzeEmotions(
  userId: string,
  text?: string,
  emojis?: string,
  audioUrl?: string
): Promise<Emotion> {
  try {
    // Appel à l'API d'analyse d'émotion via la fonction Edge Supabase
    const response = await fetch(
      'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/analyze-emotion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify({ text, emojis, userId }),
      }
    );

    // Si la réponse n'est pas OK, on utilise le fallback local
    if (!response.ok) {
      console.warn('API analyze-emotion non disponible, utilisation du fallback local');
      return createFallbackEmotion(userId, text, emojis, audioUrl);
    }

    const result: EmotionResult = await response.json();

    console.log("Résultat de l'analyse:", result);

    // Calculer un score émotionnel basé sur l'émotion détectée
    const score = calculateScoreFromEmotion(result.emotion || 'neutral');
    const emotion = result.emotion || 'neutral';
    const dateString = new Date().toISOString();

    // Créer l'entrée d'émotion pour l'enregistrement
    const newEmotion: Emotion = {
      id: `emotion-${Date.now()}`, // ID temporaire
      user_id: userId, // ID utilisateur obligatoire
      date: dateString,
      emotion,
      score,
      text,
      emojis,
      audio_url: audioUrl,
      ai_feedback: result.feedback || '',
      confidence: result.confidence || 0.5,
      source: 'api'
    };

    // S'assurer que user_id est fourni
    if (!userId) {
      console.error("Erreur: user_id est requis pour enregistrer une émotion");
      return newEmotion;
    }

    // Enregistrer l'émotion dans Supabase
    const { data, error } = await supabase
      .from('emotions')
      .insert({
        user_id: userId,
        date: dateString,
        emotion: newEmotion.emotion,
        score: newEmotion.score, 
        text: newEmotion.text,
        emojis: newEmotion.emojis,
        audio_url: newEmotion.audio_url,
        ai_feedback: newEmotion.ai_feedback,
        confidence: newEmotion.confidence,
        source: newEmotion.source
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'enregistrement de l'émotion:", error);
      // On continue avec la version locale même en cas d'erreur d'enregistrement
      return newEmotion;
    }

    // Retourner l'émotion enregistrée avec l'ID généré par la base de données
    return data as Emotion;

  } catch (error) {
    console.error("Erreur lors de l'analyse des émotions:", error);
    
    // En cas d'erreur, utiliser le fallback local
    return createFallbackEmotion(userId, text, emojis, audioUrl);
  }
}

/**
 * Fonction analyzeEmotion qui utilise analyzeEmotions sous le capot
 * Cette fonction est nécessaire pour maintenir la compatibilité avec les composants existants
 */
export async function analyzeEmotion(payload: {
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string | null;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> {
  try {
    const emotion = await analyzeEmotions(
      payload.user_id,
      payload.text,
      payload.emojis,
      payload.audio_url || undefined
    );
    
    return {
      emotion: emotion.emotion,
      confidence: emotion.confidence,
      feedback: emotion.ai_feedback,
      transcript: emotion.text
    };
  } catch (error) {
    console.error('Error in analyzeEmotion:', error);
    
    // Return a default emotion result in case of error
    return {
      emotion: 'neutral',
      confidence: 0.5,
      feedback: 'Impossible d\'analyser l\'émotion pour le moment.',
      transcript: payload.text
    };
  }
}

/**
 * Analyse d'un flux audio pour détecter l'émotion
 */
export async function analyzeAudioStream(audioData: Uint8Array[]): Promise<EmotionResult> {
  // Implémentation fictive pour l'analyse d'audio
  console.log("Analyse du flux audio...", audioData.length, "fragments");
  
  // Dans une version réelle, on enverrait les données audio à une API d'analyse
  return {
    emotion: 'calm',
    confidence: 0.7,
    transcript: "Transcription audio simulée",
    feedback: "Vous semblez calme et posé."
  };
}

/**
 * Sauvegarde des analyses d'émotions en temps réel
 */
export async function saveRealtimeEmotionScan(
  emotion: EmotionResult,
  userId: string
): Promise<void> {
  try {
    if (!userId) {
      console.error("Erreur: user_id est requis pour enregistrer une analyse en temps réel");
      return;
    }
    
    const dateString = new Date().toISOString();
    
    const newEmotion = {
      user_id: userId,
      date: dateString,
      emotion: emotion.emotion,
      score: calculateScoreFromEmotion(emotion.emotion),
      text: emotion.transcript,
      ai_feedback: emotion.feedback,
      confidence: emotion.confidence,
      source: 'realtime'
    };

    const { error } = await supabase
      .from('emotions')
      .insert(newEmotion);

    if (error) {
      console.error("Erreur lors de l'enregistrement de l'analyse en temps réel:", error);
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du scan en temps réel:", error);
  }
}

/**
 * Calculer un score basé sur l'émotion
 */
function calculateScoreFromEmotion(emotion: string): number {
  switch (emotion.toLowerCase()) {
    case 'happy': return 75;
    case 'excited': return 85;
    case 'joy': return 80;
    case 'calm': return 65;
    case 'neutral': return 50;
    case 'anxious': return 35;
    case 'sad': return 25;
    case 'angry': return 20;
    case 'frustrated': return 30;
    default: return 50;
  }
}

/**
 * Sauvegarde des analyses d'émotions
 */
export const saveEmotion = async (emotion: Emotion): Promise<Emotion | null> => {
  try {
    console.log("Saving emotion:", emotion);
    
    // S'assurer que user_id est fourni
    if (!emotion.user_id) {
      console.error("Error: user_id is required");
      return null;
    }
    
    // Ensure date is always a string
    const dateString = emotion.date instanceof Date ? emotion.date.toISOString() : emotion.date;
    
    // Create emotion data object with string date
    const emotionData = {
      ...emotion,
      date: dateString,
    };

    // Here you would typically save to a database
    // For now, just return the input
    return emotionData;
  } catch (error) {
    console.error("Error saving emotion:", error);
    return null;
  }
};
