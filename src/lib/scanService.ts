import { supabase } from '@/integrations/supabase/client';
import type { Emotion } from '@/types';

/** Sauvegarde un scan émotionnel */
export async function saveEmotionScan(entry: Omit<Emotion,'id'>): Promise<Emotion> {
  const { date, emotion, intensity, user_id, text, score, emojis, ai_feedback, audio_url } = entry;

  const { data, error } = await supabase
    .from('emotions')
    .insert({ 
      date, 
      emotion, 
      intensity, 
      user_id, 
      text, 
      score,
      emojis,
      ai_feedback,
      audio_url
    })
    .select()
    .single();

  if (error || !data) throw error || new Error('Failed to save emotion scan');
  return data as unknown as Emotion;
}

/** Récupère l'historique des scans */
export async function fetchEmotionHistory(): Promise<Emotion[]> {
  const { data, error } = await supabase
    .from('emotions')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data as unknown as Emotion[] || [];
}

// These functions can be kept for backward compatibility, but they should be updated
// to use the new functions above

export function ensureValidUUID(id: string): string {
  // Vérifier si c'est déjà un UUID valide
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  
  // Générer un UUID déterministe basé sur l'identifiant fourni
  // Pour garantir que le même ID produira toujours le même UUID
  const paddedId = id.padStart(12, '0').substring(0, 12);
  return `00000000-0000-0000-0000-${paddedId}`;
}

export async function createEmotionEntry(payload: {
  user_id?: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
}): Promise<Emotion> {
  try {
    const entry: Omit<Emotion, 'id'> = {
      date: new Date().toISOString(),
      emotion: 'neutral',  // Default emotion
      intensity: 5,        // Default intensity
      score: 50,           // Default score
      text: payload.text || '',
      emojis: payload.emojis,
      audio_url: payload.audio_url,
      user_id: payload.user_id || '00000000-0000-0000-0000-000000000000' // Default user_id if not provided
    };
    
    return await saveEmotionScan(entry);
  } catch (error) {
    console.error('Error in createEmotionEntry:', error);
    throw error;
  }
}

export async function fetchLatestEmotion(): Promise<Emotion | null> {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as Emotion | null;
  } catch (error) {
    console.error('Error in fetchLatestEmotion:', error);
    throw error;
  }
}

// Récupère les émotions d'un utilisateur
export async function getUserEmotions(userId: string): Promise<Emotion[]> {
  try {
    // Dans une vraie application, ceci serait une requête à Supabase
    // Pour l'instant, nous utilisons des données simulées
    const mockEmotions = [
      {
        id: '1',
        user_id: userId,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        emotion: 'Calme',
        score: 8,
        text: "Je me sens plus serein aujourd'hui après ma session VR",
        ai_feedback: "Votre niveau de sérénité est excellent. Continuez avec les pratiques de pleine conscience."
      },
      {
        id: '2',
        user_id: userId,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        emotion: 'Stressé',
        score: 4,
        text: "Journée difficile avec beaucoup de pression",
        ai_feedback: "Votre niveau de stress est élevé. Une session de micro-pause VR pourrait vous aider."
      },
      {
        id: '3',
        user_id: userId,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        emotion: 'Fatigué',
        score: 3,
        text: "Manque de sommeil cette semaine",
        ai_feedback: "La fatigue affecte votre bien-être. Essayez notre programme de sommeil."
      }
    ];
    
    return mockEmotions;
  } catch (error) {
    console.error('Error fetching user emotions:', error);
    throw new Error('Failed to fetch user emotions');
  }
}

// Real-time voice analysis utilities
export type AudioChunk = Uint8Array;
export type EmotionResult = {
  emotion: string;
  confidence: number;
  transcript?: string;
  id?: string;
  user_id?: string;
  date?: string;
  intensity?: number;
  score?: number;
};

// For keeping track of speech segments
export interface SpeechSegment {
  startTime: number;
  endTime?: number;
  audioChunks: AudioChunk[];
  processed: boolean;
}

// Mock implementation as placeholder for the real OpenAI integration
// In a real implementation, this would send audio to OpenAI's API
export async function analyzeAudioStream(
  audioChunks: AudioChunk[], 
  onProgress?: (text: string) => void
): Promise<EmotionResult> {
  // Simulated API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock response - in production this would be the real OpenAI response
  const mockEmotions = ['happy', 'neutral', 'stressed', 'focused', 'tired'];
  const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
  
  if (onProgress) {
    onProgress("Analyzing your voice...");
    await new Promise(resolve => setTimeout(resolve, 300));
    onProgress(`Detecting emotional patterns...`);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  const result: EmotionResult = {
    emotion: randomEmotion,
    confidence: 0.7 + Math.random() * 0.3, // Random confidence between 0.7 and 1.0
    transcript: "This is a simulated transcript of the user's speech.",
    date: new Date().toISOString(),
    intensity: Math.floor(Math.random() * 10) + 1, // Random intensity between 1-10
    score: Math.floor(Math.random() * 100) // Random score between 0-100
  };
  
  return result;
}

// Save a real-time emotion analysis result to the database
export async function saveRealtimeEmotionScan(
  result: EmotionResult, 
  userId: string
): Promise<Emotion> {
  const entry: Omit<Emotion, 'id'> = {
    date: result.date || new Date().toISOString(),
    emotion: result.emotion,
    intensity: result.intensity || Math.round(result.confidence * 10), // Convert confidence to 1-10 scale
    score: result.score || Math.round(result.confidence * 100), // Convert confidence to percentage
    text: result.transcript || '',
    user_id: userId || '00000000-0000-0000-0000-000000000000',
    ai_feedback: `You're feeling ${result.emotion} with ${Math.round(result.confidence * 100)}% confidence.`
  };
  
  return await saveEmotionScan(entry);
}

// Convert Emotion Result to Emotion type
export function emotionResultToEmotion(result: EmotionResult, userId: string): Emotion {
  return {
    id: result.id || '00000000-0000-0000-0000-000000000000',
    date: result.date || new Date().toISOString(),
    emotion: result.emotion,
    intensity: result.intensity || Math.round(result.confidence * 10),
    score: result.score || Math.round(result.confidence * 100),
    text: result.transcript || '',
    user_id: userId,
    ai_feedback: `You're feeling ${result.emotion} with ${Math.round(result.confidence * 100)}% confidence.`
  };
}
