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

// Real-time voice analysis utilities
export type AudioChunk = Uint8Array;
export type EmotionResult = {
  emotion: string;
  confidence: number;
  transcript?: string;
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
  
  return {
    emotion: randomEmotion,
    confidence: 0.7 + Math.random() * 0.3, // Random confidence between 0.7 and 1.0
    transcript: "This is a simulated transcript of the user's speech."
  };
}

// Save a real-time emotion analysis result to the database
export async function saveRealtimeEmotionScan(
  result: EmotionResult, 
  userId: string
): Promise<Emotion> {
  const entry: Omit<Emotion, 'id'> = {
    date: new Date().toISOString(),
    emotion: result.emotion,
    intensity: Math.round(result.confidence * 10), // Convert confidence to 1-10 scale
    score: Math.round(result.confidence * 100), // Convert confidence to percentage
    text: result.transcript || '',
    user_id: userId || '00000000-0000-0000-0000-000000000000',
    ai_feedback: `You're feeling ${result.emotion} with ${Math.round(result.confidence * 100)}% confidence.`
  };
  
  return await saveEmotionScan(entry);
}
