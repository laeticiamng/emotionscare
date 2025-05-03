
import { supabase } from '@/integrations/supabase/client';
import type { Emotion } from '@/types';

export async function createEmotionEntry(payload: {
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
}): Promise<Emotion> {
  try {
    // 1) Créer l'enregistrement initial (sans feedback ni score)
    const { data, error: insertErr } = await supabase
      .from('emotions')
      .insert({
        user_id: payload.user_id,
        emojis: payload.emojis,
        text: payload.text,
        audio_url: payload.audio_url || null,
      })
      .select()
      .single();

    if (insertErr || !data) throw insertErr || new Error('Insert failed');

    // 2) Simuler une analyse IA (dans une application réelle, ceci serait un appel à un service IA)
    const score = Math.floor(Math.random() * 100); // Score entre 0 et 100
    const ai_feedback = generateFakeFeedback(score);

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
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('user_id', user_id)
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

// Fonction utilitaire pour générer un feedback basé sur le score (simulation)
function generateFakeFeedback(score: number): string {
  if (score >= 80) {
    return "Vous semblez être dans un excellent état émotionnel aujourd'hui ! Votre langage est positif et énergique. Continuez à cultiver cette énergie positive dans vos interactions quotidiennes.";
  } else if (score >= 60) {
    return "Votre état émotionnel est bon. Je perçois un équilibre, mais aussi quelques traces de stress. Pensez à prendre une petite pause relaxante aujourd'hui.";
  } else if (score >= 40) {
    return "Vous semblez être dans un état émotionnel mitigé aujourd'hui. Je détecte des signes de tension et de fatigue. Une micro-pause VR pourrait vous aider à vous ressourcer.";
  } else {
    return "Votre état émotionnel semble fragile aujourd'hui. Je perçois de la fatigue et potentiellement de l'anxiété. Je recommande vivement une session de relaxation guidée ou un échange avec un collègue de confiance.";
  }
}
