
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

    // Calculer un score émotionnel basé sur l'émotion détectée (exemple simple)
    // Dans une implémentation réelle, ce serait plus sophistiqué
    let score = 50; // Score neutre par défaut
    let emotion = result.emotion || 'neutral';
    
    // Ajustement du score en fonction de l'émotion
    switch (emotion) {
      case 'happy': score = 75; break;
      case 'excited': score = 85; break;
      case 'joy': score = 80; break;
      case 'calm': score = 65; break;
      case 'neutral': score = 50; break;
      case 'anxious': score = 35; break;
      case 'sad': score = 25; break;
      case 'angry': score = 20; break;
      case 'frustrated': score = 30; break;
      default: score = 50;
    }

    // Créer l'entrée d'émotion pour l'enregistrement
    const newEmotion: Emotion = {
      id: `emotion-${Date.now()}`, // ID temporaire, sera remplacé par la base de données
      user_id: userId,
      date: new Date().toISOString(),
      emotion,
      score,
      text,
      emojis,
      audio_url: audioUrl,
      ai_feedback: result.feedback || '',
      confidence: result.confidence || 0.5,
      source: 'api'
    };

    // Enregistrer l'émotion dans Supabase
    const { data, error } = await supabase
      .from('emotions')
      .insert(newEmotion)
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
