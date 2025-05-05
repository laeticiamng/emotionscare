
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
