
import type { EmotionResult } from '@/types';

// —————————————————————————————————
// Fonction : analyzeEmotion
// —————————————————————————————————
export const analyzeEmotion = async (text: string, emojis?: string[]): Promise<EmotionResult> => {
  try {
    const response = await fetch('/api/emotion/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, emojis }),
    });

    if (!response.ok) {
      throw new Error('Échec de l\'analyse émotionnelle.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    
    // Return fallback result if API call fails
    return {
      emotion: 'neutral',
      confidence: 0.5,
      intensity: 50,
      date: new Date().toISOString(),
      ai_feedback: 'Une erreur est survenue lors de l\'analyse émotionnelle.'
    };
  }
};

// —————————————————————————————————
// Fonction : saveEmotion
// —————————————————————————————————
export const saveEmotion = async (result: EmotionResult): Promise<boolean> => {
  try {
    const response = await fetch('/api/emotion/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });

    return response.ok;
  } catch (error) {
    console.error('Error saving emotion:', error);
    return false;
  }
};

// —————————————————————————————————
// Fonction : analyzeAudioStream (mock temporaire)
// —————————————————————————————————
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Exemple fictif – à remplacer par un vrai appel API ou WebSocket
  console.log('Analyse audio en cours...', audioBlob);

  return {
    emotion: 'calm',
    confidence: 0.92,
    intensity: 70,
    date: new Date().toISOString(),
    audio_url: 'https://example.com/audio/streamed',
    transcript: 'Transcription simulée pour le test',
    ai_feedback: 'Vous semblez calme et détendu.'
  };
};

// —————————————————————————————————
// Fonction : getUserEmotions
// —————————————————————————————————
export const getUserEmotions = async (userId: string): Promise<EmotionResult[]> => {
  try {
    const response = await fetch(`/api/emotion/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des émotions.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user emotions:', error);
    return [];
  }
};
