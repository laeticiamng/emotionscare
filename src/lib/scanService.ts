
import { supabase } from '@/integrations/supabase/client';
import type { Emotion } from '@/types';

/** Sauvegarde un scan émotionnel */
export async function saveEmotionScan(entry: Omit<Emotion,'id'>): Promise<Emotion> {
  const { date, score, text, user_id } = entry;

  const { data, error } = await supabase
    .from('emotions')
    .insert({ date, score, text, user_id })
    .select()
    .single();

  if (error || !data) throw error || new Error('Failed to save emotion scan');
  return data as Emotion;
}

/** Récupère l'historique des scans */
export async function fetchEmotionHistory(): Promise<Emotion[]> {
  const { data, error } = await supabase
    .from('emotions')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data as Emotion[] || [];
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
      score: 50, // Default score
      text: payload.text || '',
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
    return data as Emotion | null;
  } catch (error) {
    console.error('Error in fetchLatestEmotion:', error);
    throw error;
  }
}
