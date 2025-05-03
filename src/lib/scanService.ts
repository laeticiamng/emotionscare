
import { supabase } from '@/integrations/supabase/client';
import type { Emotion } from '@/types';

// Fonction utilitaire pour générer un UUID valide à partir d'un identifiant quelconque
function ensureValidUUID(id: string): string {
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
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
}): Promise<Emotion> {
  try {
    // Convertir l'ID utilisateur en UUID valide
    const validUserId = ensureValidUUID(payload.user_id);
    
    // 1) Créer l'enregistrement initial (sans feedback ni score)
    const { data, error: insertErr } = await supabase
      .from('emotions')
      .insert({
        user_id: validUserId,
        emojis: payload.emojis,
        text: payload.text,
        audio_url: payload.audio_url || null,
      })
      .select()
      .single();

    if (insertErr || !data) throw insertErr || new Error('Insert failed');

    // 2) Appel à l'Edge Function pour analyser l'émotion avec OpenAI
    const { data: analysisData, error } = await supabase.functions.invoke('analyze-emotion', {
      body: {
        emojis: payload.emojis,
        text: payload.text,
        audio_url: payload.audio_url
      }
    });

    if (error) {
      console.error('Error calling analyze-emotion function:', error);
      throw new Error('Failed to analyze emotion');
    }

    const { score, ai_feedback } = analysisData;

    // 3) Mettre à jour l'entrée avec score & feedback
    const { data: updated, error: updateErr } = await supabase
      .from('emotions')
      .update({ score, ai_feedback })
      .eq('id', data.id)
      .select()
      .single();

    if (updateErr || !updated) throw updateErr || new Error('Update failed');

    return updated as Emotion;
  } catch (error) {
    console.error('Error in createEmotionEntry:', error);
    throw error;
  }
}

export async function fetchLatestEmotion(user_id: string): Promise<Emotion | null> {
  try {
    // Convertir l'ID utilisateur en UUID valide
    const validUserId = ensureValidUUID(user_id);
    
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', validUserId)
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
