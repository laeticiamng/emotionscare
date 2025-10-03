import { supabase } from '@/integrations/supabase/client';

export type VoiceEntry = {
  id: string;
  ts: string;
  user_id: string;
  user_hash?: string; // Legacy field
  audio_url: string;
  text_raw: string;
  summary_120: string;
  valence: number;
  emo_vec: number[];
  pitch_avg: number;
  crystal_meta: any;
};

export type TextEntry = {
  id: string;
  ts: string;
  user_id: string;
  user_hash?: string; // Legacy field
  text_raw: string;
  styled_html: string;
  preview: string;
  valence: number;
  emo_vec: number[];
};

/**
 * Insère une entrée de journal vocal dans Supabase
 * @throws Error si l'utilisateur n'est pas authentifié ou si l'insertion échoue
 */
export async function insertVoice(data: Omit<VoiceEntry, 'id' | 'ts' | 'user_id'>): Promise<VoiceEntry> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: row, error } = await supabase
    .from('journal_voice')
    .insert({
      user_id: user.id,
      audio_url: data.audio_url,
      text_raw: data.text_raw,
      summary_120: data.summary_120,
      valence: data.valence,
      emo_vec: data.emo_vec,
      pitch_avg: data.pitch_avg,
      crystal_meta: data.crystal_meta,
      user_hash: data.user_hash, // Optional legacy
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: row.id,
    ts: row.ts,
    user_id: row.user_id,
    user_hash: row.user_hash,
    audio_url: row.audio_url,
    text_raw: row.text_raw,
    summary_120: row.summary_120,
    valence: row.valence,
    emo_vec: row.emo_vec || [],
    pitch_avg: row.pitch_avg,
    crystal_meta: row.crystal_meta || {},
  };
}

/**
 * Insère une entrée de journal texte dans Supabase
 * @throws Error si l'utilisateur n'est pas authentifié ou si l'insertion échoue
 */
export async function insertText(data: Omit<TextEntry, 'id' | 'ts' | 'user_id'>): Promise<TextEntry> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: row, error } = await supabase
    .from('journal_text')
    .insert({
      user_id: user.id,
      text_raw: data.text_raw,
      styled_html: data.styled_html,
      preview: data.preview,
      valence: data.valence,
      emo_vec: data.emo_vec,
      user_hash: data.user_hash, // Optional legacy
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: row.id,
    ts: row.ts,
    user_id: row.user_id,
    user_hash: row.user_hash,
    text_raw: row.text_raw,
    styled_html: row.styled_html,
    preview: row.preview,
    valence: row.valence,
    emo_vec: row.emo_vec || [],
  };
}

/**
 * Récupère le feed combiné (voice + text) de l'utilisateur
 * Trié par date décroissante (plus récent en premier)
 */
export async function listFeed(userId?: string) {
  const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
  
  if (!targetUserId) {
    return [];
  }

  // Fetch voice and text entries in parallel
  const [voiceResult, textResult] = await Promise.all([
    supabase
      .from('journal_voice')
      .select('id, ts, summary_120')
      .eq('user_id', targetUserId)
      .order('ts', { ascending: false }),
    supabase
      .from('journal_text')
      .select('id, ts, preview')
      .eq('user_id', targetUserId)
      .order('ts', { ascending: false }),
  ]);

  const voiceEntries = (voiceResult.data || []).map(v => ({
    type: 'voice' as const,
    id: v.id,
    ts: v.ts,
    summary: v.summary_120,
  }));

  const textEntries = (textResult.data || []).map(t => ({
    type: 'text' as const,
    id: t.id,
    ts: t.ts,
    preview: t.preview,
  }));

  // Combine and sort
  const entries = [...voiceEntries, ...textEntries].sort((a, b) => 
    b.ts.localeCompare(a.ts)
  );

  return entries;
}
